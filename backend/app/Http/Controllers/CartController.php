<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Services\CartService;
use App\Http\Resources\CartResource;
use App\Http\Requests\StoreCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Http\Requests\CartQuantityRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CartController extends Controller
{
    use ApiResponse;

    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Display a listing of the resource.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);
        $user = $request->user();

        $carts = $this->cartService->getUserCartPaginated($user, $perPage, $currentPage);
        $resource = CartResource::collection($carts);

        return $this->paginatedResponse($resource, 'Cart items retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCartRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $productExistsInCart = $this->cartService->productExistsInCart($user, $validated['product_id']);

        $cart = $this->cartService->addToCart(
            $user,
            $validated['product_id'],
            $validated['quantity']
        );

        $statusCode = $productExistsInCart ? Response::HTTP_OK : Response::HTTP_CREATED;
        $message = $productExistsInCart
            ? 'Product quantity updated in cart.'
            : 'Product added to cart successfully.';

        return $this->successResponse(
            new CartResource($cart),
            $message,
            $statusCode
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart): JsonResponse
    {
        $cart = $this->cartService->getCartItemWithRelations($cart);

        return $this->successResponse(
            new CartResource($cart),
            'Cart item retrieved successfully.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCartRequest $request, Cart $cart): JsonResponse
    {
        $validated = $request->validated();
        $cart = $this->cartService->updateCartItem($cart, $validated);

        return $this->successResponse(
            new CartResource($cart),
            'Cart item updated successfully.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart $cart): JsonResponse
    {
        $this->cartService->removeCartItem($cart);

        return $this->successResponse(
            null,
            'Cart item removed successfully.'
        );
    }

    /**
     * Get cart items for a specific user.
     * @uses \App\Http\Middleware\AuthCookie
     */
    public function getUserCart(Request $request): JsonResponse
    {
        $user = $request->user();
        $cartData = $this->cartService->getUserCartWithSummary($user);

        $resource = CartResource::collection($cartData['items']);

        return $this->successResponse([
            'items' => $resource,
            'summary' => $cartData['summary']
        ], 'User cart retrieved successfully.');
    }

    /**
     * Clear all cart items for a user.
     * @uses \App\Http\Middleware\AuthCookie
     */
    public function clearUserCart(Request $request): JsonResponse
    {
        $user = $request->user();
        $deletedCount = $this->cartService->clearUserCart($user);

        return $this->successResponse(
            ['deleted_items' => $deletedCount],
            'Cart cleared successfully.'
        );
    }

    /**
     * Increment cart item quantity.
     */
    public function incrementQuantity(Cart $cart, CartQuantityRequest $request): JsonResponse
    {
        $amount = $request->validated()['amount'] ?? 1;
        $cart = $this->cartService->incrementQuantity($cart, $amount);

        return $this->successResponse(
            new CartResource($cart),
            'Cart item quantity incremented successfully.'
        );
    }

    /**
     * Decrement cart item quantity.
     */
    public function decrementQuantity(Cart $cart, CartQuantityRequest $request): JsonResponse
    {
        $amount = $request->validated()['amount'] ?? 1;
        $cart = $this->cartService->decrementQuantity($cart, $amount);

        if ($cart->exists) {
            return $this->successResponse(
                new CartResource($cart),
                'Cart item quantity decremented successfully.'
            );
        }

        return $this->successResponse(
            null,
            'Cart item removed (quantity reached zero).'
        );
    }

    /**
     * Set specific quantity for cart item.
     */
    public function setQuantity(Cart $cart, CartQuantityRequest $request): JsonResponse
    {
        $quantity = $request->validated()['quantity'] ?? 1;
        $cart = $this->cartService->setQuantity($cart, $quantity);

        if ($cart->exists) {
            return $this->successResponse(
                new CartResource($cart),
                'Cart item quantity updated successfully.'
            );
        }

        return $this->successResponse(
            null,
            'Cart item removed (quantity set to zero or below).'
        );
    }

    /**
     * Admin: Display a listing of all cart items.
     * 
     * @queryParam per_page int Number of items per page (default: 15)
     * @queryParam page int Current page number (default: 1)
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);

        $carts = Cart::with(['user', 'product'])
            ->paginate($perPage, ['*'], 'page', $currentPage);

        $resource = CartResource::collection($carts);

        return $this->paginatedResponse($resource, 'Cart items retrieved successfully.');
    }

    /**
     * Admin: Display the specified cart item.
     */
    public function adminShow(Cart $cart): JsonResponse
    {
        $cart->load(['user', 'product']);

        return $this->successResponse(
            new CartResource($cart),
            'Cart item retrieved successfully.'
        );
    }
}
