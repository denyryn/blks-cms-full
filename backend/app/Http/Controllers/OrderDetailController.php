<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderDetailRequest;
use App\Http\Requests\UpdateOrderDetailRequest;
use App\Http\Resources\OrderDetailResource;
use App\Models\OrderDetail;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class OrderDetailController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     * 
     * @queryParam per_page int Number of items per page (default: 15)
     * @queryParam page int Current page number (default: 1)
     * @queryParam order_id int Filter by order ID
     * @queryParam product_id int Filter by product ID
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);
        $query = OrderDetail::with(['product.category', 'order']);

        // Filter by order_id if provided
        if ($request->has('order_id')) {
            $query->where('order_id', $request->order_id);
        }

        // Filter by product_id if provided
        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        $orderDetails = $query->paginate($perPage, ['*'], 'page', $currentPage);

        return $this->successResponse(
            OrderDetailResource::collection($orderDetails)->response()->getData(),
            'Order details retrieved successfully.'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderDetailRequest $request)
    {
        try {
            $orderDetail = OrderDetail::create($request->validated());
            $orderDetail->load(['product.category', 'order']);

            return $this->successResponse(
                new OrderDetailResource($orderDetail),
                'Order detail created successfully.',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create order detail.', 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderDetail $orderDetail)
    {
        $orderDetail->load(['product.category', 'order']);

        return $this->successResponse(
            new OrderDetailResource($orderDetail),
            'Order detail retrieved successfully.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderDetailRequest $request, OrderDetail $orderDetail)
    {
        try {
            $orderDetail->update($request->validated());
            $orderDetail->load(['product.category', 'order']);

            return $this->successResponse(
                new OrderDetailResource($orderDetail),
                'Order detail updated successfully.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update order detail.', 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderDetail $orderDetail)
    {
        try {
            $orderDetail->delete();

            return $this->successResponse(
                null,
                'Order detail deleted successfully.'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete order detail.', 500);
        }
    }

    /**
     * Get order details for a specific order.
     */
    public function getOrderDetails($orderId)
    {
        $orderDetails = OrderDetail::with(['product.category'])
            ->where('order_id', $orderId)
            ->get();

        if ($orderDetails->isEmpty()) {
            return $this->errorResponse('No order details found for this order.', 404);
        }

        return $this->successResponse(
            OrderDetailResource::collection($orderDetails),
            'Order details retrieved successfully.'
        );
    }

    /**
     * Get order details for a specific product.
     * 
     * @queryParam per_page int Number of items per page (default: 15)
     * @queryParam page int Current page number (default: 1)
     */
    public function getProductOrderDetails(Request $request, $productId)
    {
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);
        $orderDetails = OrderDetail::with(['order', 'product.category'])
            ->where('product_id', $productId)
            ->paginate($perPage, ['*'], 'page', $currentPage);

        return $this->successResponse(
            OrderDetailResource::collection($orderDetails)->response()->getData(),
            'Product order details retrieved successfully.'
        );
    }

    /**
     * Get order detail statistics.
     */
    public function getOrderDetailStats()
    {
        $stats = [
            'total_order_details' => OrderDetail::count(),
            'total_quantity_sold' => OrderDetail::sum('quantity'),
            'total_revenue' => OrderDetail::selectRaw('SUM(quantity * price) as total')->first()->total ?? 0,
            'average_order_value' => OrderDetail::selectRaw('AVG(quantity * price) as avg')->first()->avg ?? 0,
            'most_sold_product' => OrderDetail::selectRaw('product_id, SUM(quantity) as total_quantity')
                ->with('product:id,name')
                ->groupBy('product_id')
                ->orderByDesc('total_quantity')
                ->first(),
        ];

        return $this->successResponse($stats, 'Order detail statistics retrieved successfully.');
    }
}
