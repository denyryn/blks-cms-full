<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CartService
{
    /**
     * Get paginated cart items for a user.
     */
    public function getUserCartPaginated(User $user, int $perPage = 15, int $currentPage = 1): LengthAwarePaginator
    {
        return Cart::with(['product.category'])
            ->where('user_id', $user->id)
            ->paginate($perPage, ['*'], 'page', $currentPage);
    }

    /**
     * Get all cart items for a user.
     */
    public function getUserCart(User $user): Collection
    {
        return Cart::where('user_id', $user->id)
            ->with(['product.category'])
            ->get();
    }

    /**
     * Add product to cart or update quantity if already exists.
     */
    public function addToCart(User $user, int $productId, int $quantity = 1): Cart
    {
        $existingCart = Cart::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existingCart) {
            return $this->incrementQuantity($existingCart, $quantity);
        }

        $cart = Cart::create([
            'user_id' => $user->id,
            'product_id' => $productId,
            'quantity' => $quantity,
        ]);

        return $cart->load(['product.category']);
    }

    /**
     * Update cart item.
     */
    public function updateCartItem(Cart $cart, array $data): Cart
    {
        $cart->update($data);
        return $cart->load(['user', 'product.category']);
    }

    /**
     * Remove cart item.
     */
    public function removeCartItem(Cart $cart): bool
    {
        return $cart->delete();
    }

    /**
     * Increment cart item quantity.
     */
    public function incrementQuantity(Cart $cart, int $amount = 1): Cart
    {
        $cart->increment('quantity', $amount);
        return $cart->load(['product.category']);
    }

    /**
     * Decrement cart item quantity.
     */
    public function decrementQuantity(Cart $cart, int $amount = 1): Cart
    {
        $newQuantity = $cart->quantity - $amount;

        if ($newQuantity <= 0) {
            $cart->delete();
            return $cart;
        }

        $cart->decrement('quantity', $amount);
        return $cart->load(['product.category']);
    }

    /**
     * Set specific quantity for cart item.
     */
    public function setQuantity(Cart $cart, int $quantity): Cart
    {
        if ($quantity <= 0) {
            $cart->delete();
            return $cart;
        }

        $cart->update(['quantity' => $quantity]);
        return $cart->load(['product.category']);
    }

    /**
     * Clear all cart items for a user.
     */
    public function clearUserCart(User $user): int
    {
        return Cart::where('user_id', $user->id)->delete();
    }

    /**
     * Get cart summary for a user.
     */
    public function getCartSummary(User $user): array
    {
        $carts = $this->getUserCart($user);

        $totalItems = $carts->sum('quantity');
        $totalPrice = $carts->sum(function ($cart) {
            return $cart->quantity * $cart->product->price;
        });
        $itemsCount = $carts->count();

        return [
            'total_items' => $totalItems,
            'total_price' => $totalPrice,
            'items_count' => $itemsCount
        ];
    }

    /**
     * Get cart with summary for a user.
     */
    public function getUserCartWithSummary(User $user): array
    {
        $carts = $this->getUserCart($user);
        $summary = $this->getCartSummary($user);

        return [
            'items' => $carts,
            'summary' => $summary
        ];
    }

    /**
     * Check if product exists in user's cart.
     */
    public function productExistsInCart(User $user, int $productId): bool
    {
        return Cart::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();
    }

    /**
     * Get specific cart item for user and product.
     */
    public function getCartItem(User $user, int $productId): ?Cart
    {
        return Cart::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->with(['product.category'])
            ->first();
    }

    /**
     * Get cart item with relationships loaded.
     */
    public function getCartItemWithRelations(Cart $cart): Cart
    {
        return $cart->load(['user', 'product.category']);
    }
}