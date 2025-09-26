<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;

class AuthController extends Controller
{
    use ApiResponse;

    public function get(Request $request)
    {
        $token = $request->cookie('auth_token');

        $accessToken = PersonalAccessToken::findToken($token);

        if (!$token || !$accessToken) {
            return $this->errorResponse(
                message: 'Unauthenticated - No token cookie found',
                code: Response::HTTP_UNAUTHORIZED
            );
        }

        return $this->successResponse(
            message: 'User retrieved successfully',
            code: Response::HTTP_OK,
            data: ['user' => $accessToken->tokenable]
        );
    }

    /**
     * Check if the email address is already registered.
     */
    public function check(Request $request)
    {
        // Check if the email address is provided
        if (!$request->email) {
            return $this->errorResponse(
                message: 'Email is required',
                code: Response::HTTP_BAD_REQUEST
            );
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return $this->errorResponse(
                message: 'Email not found',
                code: Response::HTTP_NOT_FOUND
            );
        }

        return $this->successResponse(
            data: ['user' => $user],
            message: 'Email already registered',
            code: Response::HTTP_OK
        );
    }

    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        // Create secure HttpOnly cookie
        $cookie = $this->createAuthCookie($token);

        return $this->successResponse(
            data: [
                'user' => $user,
            ],
            message: 'User registered successfully',
            code: Response::HTTP_CREATED
        )->withCookie($cookie);
    }

    /**
     * Authenticate a user and create a token.
     */
    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Create secure HttpOnly cookie
        $cookie = $this->createAuthCookie($token);

        return $this->successResponse(
            data: [
                'user' => $user
            ],
            message: 'Login successful',
            code: Response::HTTP_OK
        )->withCookie($cookie);
    }

    /**
     * Revoke the current user's token.
     */
    public function logout(Request $request)
    {
        $token = $request->cookie('auth_token');

        if ($token) {
            $accessToken = PersonalAccessToken::findToken($token);

            if ($accessToken) {
                $accessToken->delete();
            }
        }

        // Forget the cookie
        $cookie = cookie()->forget('auth_token');

        return $this->successResponse(
            message: 'Successfully logged out and token revoked.',
            code: Response::HTTP_OK
        )->withCookie($cookie);
    }

    /**
     * Create a secure HttpOnly cookie for authentication
     */
    private function createAuthCookie(string $token): Cookie
    {
        return cookie(
            name: 'auth_token',
            value: $token,
            minutes: 60 * 24 * 7, // 1 week
            secure: config('app.env') === 'production',
            httpOnly: true,
        );
    }
}