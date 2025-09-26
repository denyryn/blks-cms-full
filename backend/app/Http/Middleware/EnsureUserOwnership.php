<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserOwnership
{
    /**
     * Handle an incoming request.
     *
     * Assumes AuthCookie middleware already authenticated the user
     * and bound them into $request->user().
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            throw new AuthenticationException('Authentication required. Please log in.');
        }

        // Route parameter: user_id
        if ($request->route('user_id')) {
            $requested = $request->route('user_id');
            if ((string) $user->getKey() !== (string) $requested) {
                throw new AuthorizationException('Access denied. You can only access your own data.');
            }
        }

        // Route parameter: user (can be ID or model)
        if ($request->route('user')) {
            $requested = $request->route('user');
            if (is_object($requested)) {
                $requested = $requested->id ?? $requested->getKey();
            }
            if ((string) $user->getKey() !== (string) $requested) {
                throw new AuthorizationException('Access denied. You can only access your own data.');
            }
        }

        // Cart ownership
        if ($cart = $request->route('cart')) {
            if (is_object($cart) && ($cart->user_id ?? null) !== $user->getKey()) {
                throw new AuthorizationException('Access denied. You can only access your own cart items.');
            }
        }

        // Order ownership
        if ($order = $request->route('order')) {
            if (is_object($order) && ($order->user_id ?? null) !== $user->getKey()) {
                throw new AuthorizationException('Access denied. You can only access your own orders.');
            }
        }

        // Address ownership
        if ($address = $request->route('userAddress')) {
            if (is_object($address) && ($address->user_id ?? null) !== $user->getKey()) {
                throw new AuthorizationException('Access denied. You can only access your own addresses.');
            }
        }

        // Order detail ownership
        if ($orderDetail = $request->route('orderDetail')) {
            if (is_object($orderDetail)) {
                if (!$orderDetail->relationLoaded('order')) {
                    $orderDetail->load('order');
                }
                if ($orderDetail->order && ($orderDetail->order->user_id ?? null) !== $user->getKey()) {
                    throw new AuthorizationException('Access denied. You can only access your own order details.');
                }
            }
        }

        return $next($request);
    }
}
