// src/hooks/queries/adminCart.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCarts, clearCart } from "@/api-services/carts.service";

/* ---------- QUERIES ---------- */

// GET /api/admin/carts (all carts in system)
export const useAdminCarts = () =>
  useQuery({
    queryKey: ["admin", "carts"],
    queryFn: getCarts,
  });

/* ---------- MUTATIONS ---------- */

// DELETE /api/admin/carts (clear every cart)
export const useClearAllCarts = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "carts"] }),
  });
};
