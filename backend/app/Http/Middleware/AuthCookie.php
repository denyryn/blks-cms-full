<?php

namespace App\Http\Middleware;

use Illuminate\Auth\AuthenticationException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Laravel\Sanctum\PersonalAccessToken;

class AuthCookie
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request):Response $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('auth_token');

        if (!$token) {
            throw new AuthenticationException('Unauthenticated - No token cookie found');
        }

        $accessToken = PersonalAccessToken::findToken($token);

        if (!$accessToken || !$accessToken->tokenable) {
            throw new AuthenticationException('Unauthenticated - Invalid or expired token');
        }

        // Bind user into request (so $request->user() works)
        $request->setUserResolver(fn() => $accessToken->tokenable);

        return $next($request);
    }
}
