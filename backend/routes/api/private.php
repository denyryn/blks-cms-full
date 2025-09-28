<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderDetailController;
use App\Http\Controllers\UserAddressController;
use App\Http\Controllers\UserController;

Route::middleware(['auth.cookie', 'user.ownership'])->group(function () {

    Route::resource('carts', CartController::class)
        ->except(['create', 'edit']);

    Route::resource('orders', OrderController::class)
        ->except(['create', 'edit', 'destroy']);

    Route::resource('order_details', OrderDetailController::class)
        ->except(['create', 'edit']);

    Route::resource('user_addresses', UserAddressController::class)
        ->except(['create', 'edit']);

    Route::resource('user', UserController::class)
        ->only(['show', 'update']);
});