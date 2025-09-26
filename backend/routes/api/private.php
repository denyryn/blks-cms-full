<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderDetailController;
use App\Http\Controllers\UserAddressController;

Route::middleware(['auth.cookie', 'user.ownership'])->group(function () {

    Route::resource('carts', CartController::class)
        ->only(['index', 'show', 'store', 'update', 'destroy']);

    Route::resource('orders', OrderController::class)
        ->only(['index', 'show', 'store', 'update']);

    Route::resource('order_details', OrderDetailController::class)
        ->except(['create', 'edit']);

    Route::resource('user_addresses', UserAddressController::class)
        ->except(['create', 'edit']);

    // Additional cart routes
    Route::get('my-cart', [CartController::class, 'getUserCart'])
        ->name('carts.my-cart');
    Route::delete('my-cart', [CartController::class, 'clearUserCart'])
        ->name('carts.clear-my-cart');

    // Additional order routes
    Route::get('my-orders', [OrderController::class, 'getUserOrders'])
        ->name('orders.my-orders');
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])
        ->name('orders.status');
    Route::post('orders/from-cart', [OrderController::class, 'createFromCart'])
        ->name('orders.from-cart');

    // Additional order detail routes
    Route::get('orders/{orderId}/details', [OrderDetailController::class, 'getOrderDetails'])
        ->name('order_details.by_order');
    Route::get('products/{productId}/order-details', [OrderDetailController::class, 'getProductOrderDetails'])
        ->name('order_details.by_product');
    Route::get('order-details/stats', [OrderDetailController::class, 'getOrderDetailStats'])
        ->name('order_details.stats');

    // Additional user address routes
    Route::get('my-addresses', [UserAddressController::class, 'getUserAddresses'])
        ->name('user_addresses.my-addresses');
    Route::get('my-addresses/default', [UserAddressController::class, 'getUserDefaultAddress'])
        ->name('user_addresses.my-default');
    Route::patch('user_addresses/{userAddress}/set-default', [UserAddressController::class, 'setAsDefault'])
        ->name('user_addresses.set-default');
});