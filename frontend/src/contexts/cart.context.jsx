import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  getCarts,
  createCart,
  updateCart,
  deleteCart,
  clearCart,
} from "@/api-services/user-carts.service";
import { useAuth } from "./auth.context";

const CartCtx = createContext();

/* ------------------------------------------------------------------ */
/* Provider                                                           */
/* ------------------------------------------------------------------ */
export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState({}); // Track specific operations
  const [error, setError] = useState(null);

  /* ---------- Clear error ---------- */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* ---------- Handle API errors consistently ---------- */
  const handleError = useCallback((error, fallbackMessage) => {
    console.error("Cart operation error:", error);
    const errorMessage =
      error?.message || fallbackMessage || "Something went wrong";
    setError(errorMessage);
    return errorMessage;
  }, []);

  /* ---------- Load cart items from API ---------- */
  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return { success: true };
    }

    setLoading(true);
    setError(null);
    try {
      const { response, data } = await getCarts();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to load cart");
      }
      setCartItems(data.data || []);
      return { success: true, data: data.data };
    } catch (e) {
      const errorMessage = handleError(e, "Failed to load cart");
      setCartItems([]);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, handleError]);

  /* ---------- Clear entire cart ---------- */
  const clearCartItems = useCallback(async () => {
    if (!isAuthenticated) return;

    setOperationLoading((prev) => ({ ...prev, clearCart: true }));
    setError(null);
    try {
      const { response, data } = await clearCart();
      if (!response.ok)
        throw new Error(data?.message || "Failed to clear cart");
      setCartItems([]);
    } catch (e) {
      setError(e.message);
    } finally {
      setOperationLoading((prev) => ({ ...prev, clearCart: false }));
    }
  }, [isAuthenticated]);

  /* ---------- Add item to cart ---------- */
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!isAuthenticated) {
        return { success: false, error: "Please login to add items to cart" };
      }

      const operationKey = `add-${productId}`;
      setOperationLoading((prev) => ({ ...prev, [operationKey]: true }));
      setError(null);

      try {
        const { response, data } = await createCart({
          product_id: productId,
          quantity,
        });
        if (!response.ok) {
          throw new Error(data?.message || "Failed to add to cart");
        }

        // Reload cart to get updated data
        const loadResult = await loadCart();
        return { success: true, data: data.data };
      } catch (e) {
        const errorMessage = handleError(e, "Failed to add item to cart");
        return { success: false, error: errorMessage };
      } finally {
        setOperationLoading((prev) => ({ ...prev, [operationKey]: false }));
      }
    },
    [isAuthenticated, user, loadCart, handleError]
  );

  /* ---------- Update cart item quantity ---------- */
  const updateCartItem = useCallback(
    async (cartId, quantity) => {
      if (!isAuthenticated) return;

      const operationKey = `update-${cartId}`;
      setOperationLoading((prev) => ({ ...prev, [operationKey]: true }));
      setError(null);

      try {
        const cartItem = cartItems.find((item) => item.id === cartId);
        if (!cartItem) throw new Error("Cart item not found");

        const { response, data } = await updateCart(cartId, {
          product_id: cartItem.product_id,
          quantity,
        });
        if (!response.ok)
          throw new Error(data?.message || "Failed to update cart item");

        // Update local state immediately for better UX
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === cartId ? { ...item, quantity } : item
          )
        );
      } catch (e) {
        setError(e.message);
        // Reload cart on error to ensure consistency
        await loadCart();
      } finally {
        setOperationLoading((prev) => ({ ...prev, [operationKey]: false }));
      }
    },
    [isAuthenticated, cartItems, loadCart]
  );

  /* ---------- Remove item from cart ---------- */
  const removeFromCart = useCallback(
    async (cartId) => {
      if (!isAuthenticated) return;

      const operationKey = `remove-${cartId}`;
      setOperationLoading((prev) => ({ ...prev, [operationKey]: true }));
      setError(null);

      try {
        const { response, data } = await deleteCart(cartId);
        if (!response.ok)
          throw new Error(data?.message || "Failed to remove from cart");

        // Update local state immediately
        setCartItems((prev) => prev.filter((item) => item.id !== cartId));
      } catch (e) {
        setError(e.message);
        // Reload cart on error to ensure consistency
        await loadCart();
      } finally {
        setOperationLoading((prev) => ({ ...prev, [operationKey]: false }));
      }
    },
    [isAuthenticated, loadCart]
  );

  /* ---------- Increment item quantity ---------- */
  const incrementQuantity = useCallback(
    async (cartId) => {
      const cartItem = cartItems.find((item) => item.id === cartId);
      if (cartItem) {
        await updateCartItem(cartId, cartItem.quantity + 1);
      }
    },
    [cartItems, updateCartItem]
  );

  /* ---------- Decrement item quantity ---------- */
  const decrementQuantity = useCallback(
    async (cartId) => {
      const cartItem = cartItems.find((item) => item.id === cartId);
      if (cartItem) {
        if (cartItem.quantity <= 1) {
          await removeFromCart(cartId);
        } else {
          await updateCartItem(cartId, cartItem.quantity - 1);
        }
      }
    },
    [cartItems, updateCartItem, removeFromCart]
  );

  /* ---------- Derived state - Cart Summary ---------- */
  const cartSummary = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
    const itemsCount = cartItems.length;

    return {
      totalItems,
      totalPrice,
      itemsCount,
      isEmpty: itemsCount === 0,
    };
  }, [cartItems]);

  /* ---------- Check if product exists in cart ---------- */
  const isInCart = useCallback(
    (productId) => {
      return cartItems.some((item) => item.product_id === productId);
    },
    [cartItems]
  );

  /* ---------- Get cart item by product ID ---------- */
  const getCartItemByProductId = useCallback(
    (productId) => {
      return cartItems.find((item) => item.product_id === productId) || null;
    },
    [cartItems]
  );

  /* ---------- Context value ---------- */
  const value = useMemo(
    () => ({
      // State
      cartItems,
      loading,
      operationLoading,
      error,

      // Summary
      cartSummary,
      totalItems: cartSummary.totalItems,
      totalPrice: cartSummary.totalPrice,
      itemsCount: cartSummary.itemsCount,
      isEmpty: cartSummary.isEmpty,

      // Actions
      loadCart,
      addToCart,
      removeFromCart,
      updateCartItem,
      incrementQuantity,
      decrementQuantity,
      clearCart: clearCartItems,

      // Error handling
      clearError,

      // Utilities
      isInCart,
      getCartItemByProductId,

      // Loading states for specific operations
      isAddingToCart: (productId) =>
        operationLoading[`add-${productId}`] || false,
      isUpdatingCart: (cartId) => operationLoading[`update-${cartId}`] || false,
      isRemovingFromCart: (cartId) =>
        operationLoading[`remove-${cartId}`] || false,
      isClearingCart: operationLoading.clearCart || false,
    }),
    [
      cartItems,
      loading,
      operationLoading,
      error,
      cartSummary,
      loadCart,
      addToCart,
      removeFromCart,
      updateCartItem,
      incrementQuantity,
      decrementQuantity,
      clearCartItems,
      isInCart,
      getCartItemByProductId,
      clearError,
    ]
  );

  /* ---------- Load cart on auth change ---------- */
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCartItems([]);
      setError(null);
    }
  }, [isAuthenticated, loadCart]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
};

/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */
export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

/**
 * Hook to get cart item for a specific product
 */
export const useCartItem = (productId) => {
  const { getCartItemByProductId } = useCart();
  return useMemo(
    () => getCartItemByProductId(productId),
    [getCartItemByProductId, productId]
  );
};

/**
 * Hook to check if a product is in the cart
 */
export const useIsInCart = (productId) => {
  const { isInCart } = useCart();
  return useMemo(() => isInCart(productId), [isInCart, productId]);
};

/**
 * Hook for cart operations with a specific product
 */
export const useCartActions = (productId) => {
  const {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    getCartItemByProductId,
    isAddingToCart,
    isUpdatingCart,
    isRemovingFromCart,
  } = useCart();

  const cartItem = useMemo(
    () => getCartItemByProductId(productId),
    [getCartItemByProductId, productId]
  );

  const handleAdd = useCallback(
    (quantity = 1) => addToCart(productId, quantity),
    [addToCart, productId]
  );

  const handleRemove = useCallback(() => {
    if (cartItem) {
      removeFromCart(cartItem.id);
    }
  }, [removeFromCart, cartItem]);

  const handleIncrement = useCallback(() => {
    if (cartItem) {
      incrementQuantity(cartItem.id);
    }
  }, [incrementQuantity, cartItem]);

  const handleDecrement = useCallback(() => {
    if (cartItem) {
      decrementQuantity(cartItem.id);
    }
  }, [decrementQuantity, cartItem]);

  const isLoading = useMemo(() => {
    if (!cartItem) return isAddingToCart(productId);
    return isUpdatingCart(cartItem.id) || isRemovingFromCart(cartItem.id);
  }, [cartItem, isAddingToCart, isUpdatingCart, isRemovingFromCart, productId]);

  return {
    cartItem,
    isInCart: !!cartItem,
    quantity: cartItem?.quantity || 0,
    isLoading,
    add: handleAdd,
    remove: handleRemove,
    increment: handleIncrement,
    decrement: handleDecrement,
  };
};

/* ------------------------------------------------------------------ */
/* Render-prop helpers (optional)                                     */
/* ------------------------------------------------------------------ */
export const IfCartEmpty = ({ children, fallback = null }) => {
  const { isEmpty } = useCart();
  return isEmpty ? children : fallback;
};

export const IfCartNotEmpty = ({ children, fallback = null }) => {
  const { isEmpty } = useCart();
  return !isEmpty ? children : fallback;
};
