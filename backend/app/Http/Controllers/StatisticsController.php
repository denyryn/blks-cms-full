<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\Cart;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    use ApiResponse;

    /**
     * Get general statistics overview
     */
    public function overview(): JsonResponse
    {
        $stats = [
            'users' => [
                'total' => User::count(),
                'admins' => User::where('role', 'admin')->count(),
                'regular_users' => User::where('role', 'user')->count(),
                'new_this_month' => User::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
            ],
            'products' => [
                'total' => Product::count(),
                'categories' => Category::count(),
                'average_price' => Product::avg('price'),
            ],
            'orders' => [
                'total' => Order::count(),
                'pending' => Order::where('status', 'pending')->count(),
                'processing' => Order::where('status', 'processing')->count(),
                'shipped' => Order::where('status', 'shipped')->count(),
                'delivered' => Order::where('status', 'delivered')->count(),
                'cancelled' => Order::where('status', 'cancelled')->count(),
                'this_month' => Order::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
            ],
            'revenue' => [
                'total' => Order::sum('total_price'),
                'this_month' => Order::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->sum('total_price'),
                'this_year' => Order::whereYear('created_at', now()->year)
                    ->sum('total_price'),
                'average_order_value' => Order::avg('total_price'),
            ],
            'carts' => [
                'active_carts' => Cart::distinct('user_id')->count(),
                'total_items' => Cart::sum('quantity'),
                'abandoned_value' => Cart::join('products', 'carts.product_id', '=', 'products.id')
                    ->sum(DB::raw('carts.quantity * products.price')),
            ],
        ];

        return $this->successResponse($stats, 'Statistics retrieved successfully');
    }

    /**
     * Get user statistics
     */
    public function users(): JsonResponse
    {
        $stats = [
            'total_users' => User::count(),
            'users_by_role' => User::select('role', DB::raw('count(*) as count'))
                ->groupBy('role')
                ->get(),
            'new_users_last_30_days' => User::where('created_at', '>=', now()->subDays(30))
                ->count(),
            'users_with_orders' => User::whereHas('orders')->count(),
            'top_customers' => User::withCount('orders')
                ->withSum('orders', 'total_price')
                ->having('orders_count', '>', 0)
                ->orderBy('orders_sum_total_price', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'email']),
            'registration_trend' => User::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date')
                ->get(),
        ];

        return $this->successResponse($stats, 'User statistics retrieved successfully');
    }

    /**
     * Get product statistics
     */
    public function products(): JsonResponse
    {
        $stats = [
            'total_products' => Product::count(),
            'products_by_category' => Product::join('categories', 'products.category_id', '=', 'categories.id')
                ->select('categories.name as category_name', DB::raw('count(*) as count'))
                ->groupBy('categories.id', 'categories.name')
                ->get(),
            'products_by_status' => [
                'total' => Product::count(),
            ],
            'price_statistics' => [
                'average' => Product::avg('price'),
                'minimum' => Product::min('price'),
                'maximum' => Product::max('price'),
            ],
            'stock_statistics' => [
                'average_price' => Product::avg('price'),
                'total_products' => Product::count(),
            ],
            'most_popular_products' => Product::withCount(['orderDetails'])
                ->orderBy('order_details_count', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'price']),
        ];

        return $this->successResponse($stats, 'Product statistics retrieved successfully');
    }

    /**
     * Get order statistics
     */
    public function orders(): JsonResponse
    {
        $stats = [
            'total_orders' => Order::count(),
            'orders_by_status' => Order::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get(),
            'revenue_statistics' => [
                'total_revenue' => Order::sum('total_price'),
                'average_order_value' => Order::avg('total_price'),
                'highest_order_value' => Order::max('total_price'),
                'lowest_order_value' => Order::min('total_price'),
            ],
            'monthly_orders' => Order::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_price) as revenue')
            )
                ->where('created_at', '>=', now()->subMonths(12))
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
                ->orderBy('year')
                ->orderBy('month')
                ->get(),
            'daily_orders_last_week' => Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_price) as revenue')
            )
                ->where('created_at', '>=', now()->subDays(7))
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date')
                ->get(),
            'recent_orders' => Order::with(['user:id,name,email'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(['id', 'user_id', 'total_price', 'status', 'created_at']),
        ];

        return $this->successResponse($stats, 'Order statistics retrieved successfully');
    }

    /**
     * Get revenue statistics with date filtering
     */
    public function revenue(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->subYear()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));

        $stats = [
            'total_revenue' => Order::whereBetween('created_at', [$startDate, $endDate])
                ->sum('total_price'),
            'orders_count' => Order::whereBetween('created_at', [$startDate, $endDate])
                ->count(),
            'average_order_value' => Order::whereBetween('created_at', [$startDate, $endDate])
                ->avg('total_price'),
            'daily_revenue' => Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_price) as revenue'),
                DB::raw('COUNT(*) as orders_count')
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date')
                ->get(),
            'monthly_revenue' => Order::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_price) as revenue'),
                DB::raw('COUNT(*) as orders_count')
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
                ->orderBy('year')
                ->orderBy('month')
                ->get(),
            'top_revenue_days' => Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_price) as revenue')
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('revenue', 'desc')
                ->limit(10)
                ->get(),
        ];

        return $this->successResponse($stats, 'Revenue statistics retrieved successfully');
    }

    /**
     * Get dashboard summary with key metrics
     */
    public function dashboard(): JsonResponse
    {
        $stats = [
            'today' => [
                'orders' => Order::whereDate('created_at', today())->count(),
                'revenue' => Order::whereDate('created_at', today())->sum('total_price'),
                'new_users' => User::whereDate('created_at', today())->count(),
            ],
            'this_week' => [
                'orders' => Order::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                'revenue' => Order::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->sum('total_price'),
                'new_users' => User::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            ],
            'this_month' => [
                'orders' => Order::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count(),
                'revenue' => Order::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('total_price'),
                'new_users' => User::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count(),
            ],
            'totals' => [
                'users' => User::count(),
                'products' => Product::count(),
                'orders' => Order::count(),
                'revenue' => Order::sum('total_price'),
            ],
            'recent_activity' => [
                'recent_orders' => Order::with('user:id,name')->orderBy('created_at', 'desc')->limit(5)->get(['id', 'user_id', 'total_price', 'status', 'created_at']),
                'recent_users' => User::orderBy('created_at', 'desc')->limit(5)->get(['id', 'name', 'email', 'created_at']),
            ],
        ];

        return $this->successResponse($stats, 'Dashboard statistics retrieved successfully');
    }
}