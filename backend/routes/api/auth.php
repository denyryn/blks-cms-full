<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('/check', [AuthController::class, 'check'])
        ->name('check');

    Route::post('/login', [AuthController::class, 'login'])
        ->name('login');

    Route::post('/register', [AuthController::class, 'register'])
        ->name('register');

    Route::get('/me', [AuthController::class, 'get'])
        ->name('user');
});

Route::middleware('auth.cookie')->prefix('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('logout');
});