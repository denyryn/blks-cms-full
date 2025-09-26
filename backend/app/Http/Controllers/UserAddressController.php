<?php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use App\Http\Resources\UserAddressResource;
use App\Http\Requests\StoreUserAddressRequest;
use App\Http\Requests\UpdateUserAddressRequest;
use App\Traits\ApiResponse;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UserAddressController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     * 
     * @queryParam per_page int Number of items per page (default: 15)
     * @queryParam page int Current page number (default: 1)
     * @queryParam user_id int Filter by user ID
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);
        $userId = $request->get('user_id');

        $query = UserAddress::with(['user']);

        // Filter by user if provided
        if ($userId) {
            $query->where('user_id', $userId);
        }

        // Order by default first, then by created date
        $query->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc');

        $addresses = $query->paginate($perPage, ['*'], 'page', $currentPage);
        $resource = UserAddressResource::collection($addresses);

        return $this->paginatedResponse($resource, 'User addresses retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserAddressRequest $request): JsonResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            // If this is set as default, unset other default addresses for this user
            if (isset($validated['is_default']) && $validated['is_default']) {
                UserAddress::where('user_id', $validated['user_id'])
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $address = UserAddress::create($validated);
            $address->load('user');

            DB::commit();

            return $this->successResponse(
                new UserAddressResource($address),
                'User address created successfully.',
                Response::HTTP_CREATED
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse(
                'Failed to create address: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(UserAddress $userAddress): JsonResponse
    {
        $userAddress->load('user');

        return $this->successResponse(
            new UserAddressResource($userAddress),
            'User address retrieved successfully.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserAddressRequest $request, UserAddress $userAddress): JsonResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            // If this is set as default, unset other default addresses for this user
            if (isset($validated['is_default']) && $validated['is_default']) {
                UserAddress::where('user_id', $userAddress->user_id)
                    ->where('id', '!=', $userAddress->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $userAddress->update($validated);
            $userAddress->load('user');

            DB::commit();

            return $this->successResponse(
                new UserAddressResource($userAddress),
                'User address updated successfully.'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse(
                'Failed to update address: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserAddress $userAddress): JsonResponse
    {
        // Check if address is being used by any orders
        if ($userAddress->orders()->exists()) {
            return $this->errorResponse(
                'Cannot delete address that is used in orders.',
                Response::HTTP_CONFLICT
            );
        }

        $userAddress->delete();

        return $this->successResponse(
            null,
            'User address deleted successfully.'
        );
    }

    /**
     * Get addresses for the authenticated user.
     */
    public function getUserAddresses(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return $this->errorResponse(
                'Unauthenticated - No user found',
                Response::HTTP_UNAUTHORIZED
            );
        }

        $addresses = UserAddress::where('user_id', $user->id)
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();

        return $this->successResponse(
            UserAddressResource::collection($addresses),
            'User addresses retrieved successfully.'
        );
    }

    /**
     * Get the authenticated user's default address.
     */
    public function getUserDefaultAddress(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return $this->errorResponse(
                'Unauthenticated - No user found',
                Response::HTTP_UNAUTHORIZED
            );
        }

        $address = UserAddress::where('user_id', $user->id)
            ->where('is_default', true)
            ->first();

        if (!$address) {
            return $this->errorResponse(
                'No default address found for this user.',
                Response::HTTP_NOT_FOUND
            );
        }

        return $this->successResponse(
            new UserAddressResource($address),
            'Default address retrieved successfully.'
        );
    }

    /**
     * Set an address as default for the authenticated user.
     */
    public function setAsDefault(Request $request, UserAddress $userAddress): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return $this->errorResponse(
                'Unauthenticated - No user found',
                Response::HTTP_UNAUTHORIZED
            );
        }

        if ($userAddress->user_id !== $user->id) {
            return $this->errorResponse(
                'Forbidden - This address does not belong to you.',
                Response::HTTP_FORBIDDEN
            );
        }

        try {
            DB::transaction(function () use ($user, $userAddress) {
                // Unset other default addresses
                UserAddress::where('user_id', $user->id)
                    ->where('id', '!=', $userAddress->id)
                    ->update(['is_default' => false]);

                // Set this one as default
                $userAddress->update(['is_default' => true]);
            });

            $userAddress->refresh();

            return $this->successResponse(
                new UserAddressResource($userAddress),
                'Address set as default successfully.'
            );
        } catch (\Throwable $e) {
            return $this->errorResponse(
                'Failed to set address as default: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
