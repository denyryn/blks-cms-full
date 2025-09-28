<?php


use App\Http\Controllers\GuestMessageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderDetailController;
use App\Http\Controllers\UserAddressController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StatisticsController;

Route::middleware(['auth.cookie', 'role:admin'])->prefix('admin')->group(function () {
    Route::resource('users', UserController::class)
        ->except(['create', 'edit']);

    // Admin product management
    Route::get('products', [ProductController::class, 'adminIndex']);
    Route::get('products/{product}', [ProductController::class, 'adminShow']);
    Route::resource('products', ProductController::class)
        ->except(['create', 'edit', 'index', 'show',]);

    // Admin category management  
    Route::get('categories', [CategoryController::class, 'adminIndex']);
    Route::get('categories/{category}', [CategoryController::class, 'adminShow']);
    Route::resource('categories', CategoryController::class)
        ->except(['create', 'edit', 'index', 'show',]);

    // Admin cart management - only viewing capabilities
    Route::get('carts', [CartController::class, 'adminIndex']);
    Route::get('carts/{cart}', [CartController::class, 'adminShow']);

    // Admin order management
    Route::resource('orders', OrderController::class)
        ->except(['create', 'edit']);

    Route::resource('order-details', OrderDetailController::class)
        ->except(['create', 'edit']);

    Route::resource('user-addresses', UserAddressController::class)
        ->except(['create', 'edit']);

    Route::resource('guest-messages', GuestMessageController::class)
        ->except(['store']);

    // Admin statistics
    Route::prefix('statistics')->name('admin.statistics.')->group(function () {
        Route::get('overview', [StatisticsController::class, 'overview'])
            ->name('overview');
        Route::get('dashboard', [StatisticsController::class, 'dashboard'])
            ->name('dashboard');
        Route::get('users', [StatisticsController::class, 'users'])
            ->name('users');
        Route::get('products', [StatisticsController::class, 'products'])
            ->name('products');
        Route::get('orders', [StatisticsController::class, 'orders'])
            ->name('orders');
        Route::get('revenue', [StatisticsController::class, 'revenue'])
            ->name('revenue');
        Route::get('guest-messages', [GuestMessageController::class, 'statistics'])
            ->name('guest-messages');
    });
});