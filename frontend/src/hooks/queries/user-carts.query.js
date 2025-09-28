// src/hooks/queries/cart.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCarts,
  getCart,
  createCart,
  updateCart,
  deleteCart,
  clearCart,
} from "@/api-services/carts.service";

/* ---------- QUERIES ---------- */

// GET /api/carts (auth user’s cart list)
export const useCarts = () =>
  useQuery({
    queryKey: ["carts"],
    queryFn: getCarts,
  });

// GET /api/carts/:id (single cart row)
export const useCart = (id) =>
  useQuery({
    queryKey: ["carts", id],
    queryFn: () => getCart(id),
    enabled: !!id,
  });

/* ---------- MUTATIONS ---------- */

// POST /api/carts (add item)
export const useCreateCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["carts"] }),
  });
};

// PUT /api/carts/:id (change quantity)
export const useUpdateCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCart(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["carts"] }),
  });
};

// DELETE /api/carts/:id (remove single row)
export const useDeleteCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["carts"] }),
  });
};

// DELETE /api/carts (clear entire cart)
export const useClearCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["carts"] }),
  });
};
