<?php

use App\Http\Middleware\AuthCookie;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            EnsureFrontendRequestsAreStateful::class,
        ]);
        $middleware->alias([
            'auth.cookie' => AuthCookie::class,
            'user.ownership' => \App\Http\Middleware\EnsureUserOwnership::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->renderable(function (Throwable $e, Request $request) {
            if (!$request->is('api/*')) {
                return null;
            }

            $api = new class {
                use \App\Traits\ApiResponse;
            };

            $map = [
                Symfony\Component\HttpKernel\Exception\HttpException::class => fn($e) => $api->errorResponse($e->getMessage(), $e->getStatusCode()),
                \Illuminate\Database\Eloquent\ModelNotFoundException::class => fn() => $api->notFoundResponse(),
                \Illuminate\Validation\ValidationException::class => fn($e) => $api->validationErrorResponse($e->errors()),
                \Illuminate\Auth\AuthenticationException::class => fn() => $api->unauthorizedResponse(),
                \Illuminate\Auth\Access\AuthorizationException::class => fn() => $api->forbiddenResponse(),
            ];

            foreach ($map as $class => $handler) {
                if ($e instanceof $class) {
                    return $handler($e);
                }
            }

            // Log only unexpected errors
            report($e);

            return $api->errorResponse(
                message: app()->isLocal() ? $e->getMessage() : 'Internal Server Error',
                code: 500
            );
        });
    })
    ->create();

