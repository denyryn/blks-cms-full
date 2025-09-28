// src/features/orders/api.js
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
} from "@/api-services/orders.service";
import { toast } from "sonner";

/* ---------- QUERIES ---------- */

// GET /api/orders?page=&per_page=  (paginated list)
export const useOrders = ({ page = 1, perPage = 10 } = {}) =>
  useQuery({
    queryKey: ["orders", page, perPage],
    queryFn: async () => {
      const { data: json, response } = await getOrders({ page, perPage });
      if (!response.ok) throw new Error("Failed to fetch orders");
      return json.data;
    },
    keepPreviousData: true, // smooth pagination
  });

// GET /api/orders/:id  (single order)
export const useOrder = (id) =>
  useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data: json, response } = await getOrder(id);
      if (!response.ok) toast.error("Failed to fetch order");
      return json.data;
    },
    enabled: !!id, // don’t fire when id is undefined
  });

// Infinite-scroll version (optional)
export const useOrdersInfinite = ({ perPage = 10 } = {}) =>
  useInfiniteQuery({
    queryKey: ["orders", "infinite"],
    queryFn: ({ pageParam = 1 }) => getOrders({ page: pageParam, perPage }),
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
  });

/* ---------- MUTATIONS ---------- */

// POST /api/orders  (create)
export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] }); // refresh lists
    },
  });
};

// PUT /api/orders/:id  (upload payment proof)
export const useUpdateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateOrder,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["orders", variables.id] }); // single order
      qc.invalidateQueries({ queryKey: ["orders"] }); // list
    },
  });
};
