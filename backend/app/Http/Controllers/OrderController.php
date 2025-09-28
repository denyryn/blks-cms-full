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

            $totalPrice = 0;
            $orderDetails = [];

            // Handle cart-based order
            if (!empty($validated['cart_ids'])) {
                // Get cart items
                $cartItems = \App\Models\Cart::whereIn('id', $validated['cart_ids'])
                    ->where('user_id', $validated['user_id'])
                    ->with('product')
                    ->get();

                if ($cartItems->isEmpty()) {
                    DB::rollBack();
                    return $this->errorResponse(
                        'No valid cart items found.',
                        Response::HTTP_BAD_REQUEST
                    );
                }

                // Calculate total price and prepare order details from cart
                foreach ($cartItems as $cart) {
                    $price = $cart->product->price;
                    $quantity = $cart->quantity;
                    $totalPrice += $quantity * $price;

                    $orderDetails[] = [
                        'product_id' => $cart->product_id,
                        'quantity' => $quantity,
                        'price' => $price
                    ];
                }
            }
            // Handle direct order with order_details
            else {
                foreach ($validated['order_details'] as $detail) {
                    $totalPrice += $detail['quantity'] * $detail['price'];
                    $orderDetails[] = $detail;
                }
            }

            // Create the order
            $orderData = [
                'user_id' => $validated['user_id'],
                'user_address_id' => $validated['user_address_id'],
                'total_price' => $totalPrice,
                'payment_proof' => null,
                'status' => $validated['status'] ?? 'pending'
            ];

            // Handle payment proof file upload
            if ($request->hasFile('payment_proof')) {
                $file = $request->file('payment_proof');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('payment_proofs', $filename, 'public');
                $orderData['payment_proof'] = $path;
            }

            $order = Order::create($orderData);

            // Create order details
            foreach ($orderDetails as $detail) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $detail['product_id'],
                    'quantity' => $detail['quantity'],
                    'price' => $detail['price']
                ]);
            }

            // Remove items from cart if this was a cart-based order
            if (!empty($validated['cart_ids'])) {
                \App\Models\Cart::whereIn('id', $validated['cart_ids'])->delete();
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
}
