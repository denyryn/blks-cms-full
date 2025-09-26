<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\GuestMessageController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::resource('products', ProductController::class)
    ->only(['index', 'show']);

Route::resource('categories', CategoryController::class)
    ->only(['index', 'show']);

Route::resource('guest-messages', GuestMessageController::class)
    ->only(['store']);