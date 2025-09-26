<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Laravel\Sanctum\PersonalAccessToken;

class AuthCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('auth_token');

        if (!$token) {
            throw new \Illuminate\Auth\AuthenticationException('Unauthenticated - No token cookie found');
        }

        $accessToken = PersonalAccessToken::findToken($token);

        if (!$accessToken || !$accessToken->tokenable) {
            throw new \Illuminate\Auth\AuthenticationException('Unauthenticated - Invalid or expired token');
        }

        // Bind user into request (so $request->user() works)
        $request->setUserResolver(fn() => $accessToken->tokenable);

        return $next($request);
    }
}
