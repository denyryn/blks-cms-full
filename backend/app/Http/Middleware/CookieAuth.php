<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CookieAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check for session-based authentication first
        if (Auth::guard('web')->check()) {
            // User is authenticated via session/cookies
            $request->setUserResolver(function () {
                return Auth::guard('web')->user();
            });
            return $next($request);
        }

        // Check for Sanctum token as fallback
        if (Auth::guard('sanctum')->check()) {
            $request->setUserResolver(function () {
                return Auth::guard('sanctum')->user();
            });
            return $next($request);
        }

        // Check if there's a remember token in cookies
        if ($request->hasCookie('remember_token')) {
            $rememberToken = $request->cookie('remember_token');
            if ($rememberToken && Auth::guard('web')->loginUsingId($rememberToken)) {
                return $next($request);
            }
        }

        return response()->json([
            'code' => 401,
            'status' => 'error',
            'message' => 'Authentication required. Please log in with valid credentials.'
        ], 401);
    }
}
