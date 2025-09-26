<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Http\Resources\OrderResource;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     * 
     * @queryParam per_page int Number of items per page (default: 15)
     * @queryParam page int Current page number (default: 1)
     * @queryParam user_id int Filter by user ID
     * @queryParam status string Filter by order status
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);
        $userId = $request->get('user_id');
        $status = $request->get('status');

        $query = Order::with(['user', 'shippingAddress', 'orderDetails.product.category']);

        // Filter by user if provided
        if ($userId) {
            $query->where('user_id', $userId);
        }

        // Filter by status if provided
        if ($status) {
            $query->where('status', $status);
        }

        // Order by most recent first
        $query->orderBy('created_at', 'desc');

        $orders = $query->paginate($perPage, ['*'], 'page', $currentPage);
        $resource = OrderResource::collection($orders);

        return $this->paginatedResponse($resource, 'Orders retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            // Create the order
            $orderData = [
                'user_id' => $validated['user_id'],
                'shipping_address_id' => $validated['shipping_address_id'],
                'total_price' => $validated['total_price'],
                'payment_proof' => $validated['payment_proof'] ?? null,
                'status' => $validated['status']
            ];

            $order = Order::create($orderData);

            // Create order details
            foreach ($validated['order_details'] as $detail) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $detail['product_id'],
                    'quantity' => $detail['quantity'],
                    'price' => $detail['price']
                ]);
            }

            $order->load(['user', 'shippingAddress', 'orderDetails.product.category']);

            DB::commit();

            return $this->successResponse(
                new OrderResource($order),
                'Order created successfully.',
                Response::HTTP_CREATED
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse(
                'Failed to create order: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order): JsonResponse
    {
        $order->load(['user', 'shippingAddress', 'orderDetails.product.category']);

        return $this->successResponse(
            new OrderResource($order),
            'Order retrieved successfully.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order): JsonResponse
    {
        $validated = $request->validated();
        $order->update($validated);
        $order->load(['user', 'shippingAddress', 'orderDetails.product.category']);

        return $this->successResponse(
            new OrderResource($order),
            'Order updated successfully.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order): JsonResponse
    {
        // Only allow deletion of pending or cancelled orders
        if (!in_array($order->status, ['pending', 'cancelled'])) {
            return $this->errorResponse(
                'Cannot delete orders that are paid, shipped, or completed.',
                Response::HTTP_CONFLICT
            );
        }

        $order->delete();

        return $this->successResponse(
            null,
            'Order deleted successfully.'
        );
    }

    /**
     * Get orders for the authenticated user.
     */
    public function getUserOrders(Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'nullable|string|in:pending,paid,shipped,completed,cancelled'
        ]);

        $user = $request->user();

        $query = Order::where('user_id', $user->id)
            ->with(['shippingAddress', 'orderDetails.product.category'])
            ->orderBy('created_at', 'desc');

        if ($request->get('status')) {
            $query->where('status', $request->get('status'));
        }

        $orders = $query->get();
        $resource = OrderResource::collection($orders);

        return $this->successResponse(
            $resource,
            'User orders retrieved successfully.'
        );
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => 'required|string|in:pending,paid,shipped,completed,cancelled'
        ]);

        $order->update(['status' => $request->get('status')]);
        $order->load(['user', 'shippingAddress', 'orderDetails.product.category']);

        return $this->successResponse(
            new OrderResource($order),
            'Order status updated successfully.'
        );
    }

    /**
     * Create order from cart items.
     */
    public function createFromCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'shipping_address_id' => 'required|exists:user_addresses,id',
            'cart_ids' => 'required|array|min:1',
            'cart_ids.*' => 'exists:carts,id',
            'payment_proof' => 'nullable|string|max:255'
        ]);

        try {
            DB::beginTransaction();

            // Get cart items
            $cartItems = \App\Models\Cart::whereIn('id', $validated['cart_ids'])
                ->where('user_id', $validated['user_id'])
                ->with('product')
                ->get();

            if ($cartItems->isEmpty()) {
                return $this->errorResponse(
                    'No valid cart items found.',
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Calculate total price
            $totalPrice = $cartItems->sum(function ($cart) {
                return $cart->quantity * $cart->product->price;
            });

            // Create order
            $order = Order::create([
                'user_id' => $validated['user_id'],
                'shipping_address_id' => $validated['shipping_address_id'],
                'total_price' => $totalPrice,
                'payment_proof' => $validated['payment_proof'] ?? null,
                'status' => 'pending'
            ]);

            // Create order details
            foreach ($cartItems as $cart) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $cart->product_id,
                    'quantity' => $cart->quantity,
                    'price' => $cart->product->price
                ]);
            }

            // Remove items from cart
            \App\Models\Cart::whereIn('id', $validated['cart_ids'])->delete();

            $order->load(['user', 'shippingAddress', 'orderDetails.product.category']);

            DB::commit();

            return $this->successResponse(
                new OrderResource($order),
                'Order created from cart successfully.',
                Response::HTTP_CREATED
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse(
                'Failed to create order from cart: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
