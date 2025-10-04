<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     * 
     * @queryParam per_page int Number of items per page (default: 15)
     * @queryParam page int Current page number (default: 1)
     * @queryParam search string Search term for user name or email
     * @queryParam role string Filter by user role (admin, user)
     * @queryParam sort string Sort users by name (name-asc, name-desc) or created date (created-asc, created-desc)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);
        $search = $request->get('search');
        $role = $request->get('role');
        $sort = $request->get('sort');

        $query = User::query();

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply role filter
        if ($role && in_array($role, ['admin', 'user'])) {
            $query->where('role', $role);
        }

        // Apply sorting
        switch ($sort) {
            case 'name-asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name-desc':
                $query->orderBy('name', 'desc');
                break;
            case 'created-asc':
                $query->orderBy('created_at', 'asc');
                break;
            case 'created-desc':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $users = $query->paginate($perPage, ['*'], 'page', $currentPage);
        $resource = UserResource::collection($users);

        return $this->paginatedResponse($resource, 'Users retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Hash the password
            $validated['password'] = Hash::make($validated['password']);

            // Set default role if not provided
            if (!isset($validated['role'])) {
                $validated['role'] = 'user';
            }

            $user = User::create($validated);

            $resource = new UserResource($user);

            return $this->successResponse(
                $resource,
                'User created successfully.',
                Response::HTTP_CREATED
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                'Failed to create user: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Display the specified resource.
     * For private routes: shows current authenticated user
     * For admin routes: shows specific user by ID
     */
    public function show(Request $request, $id = null): JsonResponse
    {
        try {
            $user = null;

            // Check if this is a private route (user accessing their own data)
            // or if 'me' is passed as ID
            if ($id === 'me' || is_null($id) || $request->route()->getPrefix() !== 'api/admin') {
                // Get current authenticated user from cookie session
                $user = $request->user();

                if (!$user) {
                    return $this->unauthorizedResponse('User not authenticated.');
                }

                // Load relationships for better user data
                $user->load([
                    'addresses',
                    'defaultAddress',
                    'orders' => function ($query) {
                        $query->latest()->limit(5); // Load only recent orders
                    }
                ]);
            } else {
                // Admin accessing specific user by ID
                $user = User::with(['addresses', 'defaultAddress', 'orders'])
                    ->findOrFail($id);
            }

            $resource = new UserResource($user);

            return $this->successResponse(
                $resource,
                'User retrieved successfully.'
            );
        } catch (ModelNotFoundException $e) {
            return $this->notFoundResponse('User not found.');
        } catch (Exception $e) {
            return $this->errorResponse(
                'Failed to retrieve user: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Update the specified resource in storage.
     * For private routes: updates current authenticated user
     * For admin routes: updates specific user by ID
     */
    public function update(UpdateUserRequest $request, $id = null): JsonResponse
    {
        try {
            $user = null;

            // Check if this is a private route (user updating their own data)
            // or if 'me' is passed as ID
            if ($id === 'me' || is_null($id) || $request->route()->getPrefix() !== 'api/admin') {
                // Get current authenticated user from cookie session
                $user = $request->user();

                if (!$user) {
                    return $this->unauthorizedResponse('User not authenticated.');
                }
            } else {
                // Admin updating specific user by ID
                $user = User::findOrFail($id);
            }

            $validated = $request->validated();

            // Hash password if provided
            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            // Don't allow regular users to change their role
            if ($request->route()->getPrefix() !== 'api/admin' && isset($validated['role'])) {
                unset($validated['role']);
            }

            $user->update($validated);

            // Load relationships for the response
            $user->load(['addresses', 'defaultAddress']);
            $resource = new UserResource($user);

            return $this->successResponse(
                $resource,
                'User updated successfully.'
            );
        } catch (ModelNotFoundException $e) {
            return $this->notFoundResponse('User not found.');
        } catch (Exception $e) {
            return $this->errorResponse(
                'Failed to update user: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Prevent deleting the last admin user
            if ($user->role === 'admin') {
                $adminCount = User::where('role', 'admin')->count();
                if ($adminCount <= 1) {
                    return $this->errorResponse(
                        'Cannot delete the last admin user.',
                        Response::HTTP_FORBIDDEN
                    );
                }
            }

            $user->delete();

            return $this->successResponse(
                null,
                'User deleted successfully.'
            );
        } catch (ModelNotFoundException $e) {
            return $this->notFoundResponse('User not found.');
        } catch (Exception $e) {
            return $this->errorResponse(
                'Failed to delete user: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
