<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    protected array $roles;

    public function __construct()
    {
        $this->roles = [];
    }

    /**
     * Handle an incoming request.
     *
     * Usage: ->middleware('role:admin') OR ->middleware('role:admin,editor')
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'Unauthenticated');
        }

        if (!in_array($user->role, $roles)) {
            abort(403, 'Forbidden - Insufficient permissions');
        }

        return $next($request);
    }
}
