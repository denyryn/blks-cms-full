<?php

namespace App\Http\Controllers;

use Exception;
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
        $defaultType = $request->get('default', null);
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);
        $userId = $request->user->role === 'admin' ? $request->get('user_id') : $request->user->id;

        $query = UserAddress::with(['user']);

        // Filter by user if provided
        if ($userId) {
            $query->where('user_id', $userId);
        }

        // Filter by default type if provided
        if ($defaultType !== null) {
            $query->where('is_default', (bool) $defaultType);
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

            $user = $request->user();
            if (!$user) {
                DB::rollBack();
                return $this->errorResponse(
                    'User not authenticated.',
                    Response::HTTP_UNAUTHORIZED
                );
            }

            // Check if user has roles relation and contains 'user' role
            if ($user->roles && $user->roles->contains('name', 'user')) {
                // force normal users to only use their own ID
                $validated['user_id'] = $user->id;
            }

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

        } catch (Exception $e) {
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

        } catch (Exception $e) {
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
}
