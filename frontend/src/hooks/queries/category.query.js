// src/hooks/queries/category.js
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCategories,
  getCategory,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api-services/category.service";
import { toast } from "sonner";

/* ---------- QUERIES ---------- */

// GET /api/categories (paginated list)
export const useCategories = ({ page = 1, perPage = 10 } = {}) =>
  useQuery({
    queryKey: ["categories", page, perPage],
    queryFn: async () => {
      const { response, data: json } = await getCategories({ page, perPage });
      if (!response.ok)
        return toast.error(json.message || "Gagal memuat kategori");
      console.log(json.data);
      return json.data;
    },
    keepPreviousData: true,
  });

// GET /api/categories/:id (single category)
export const useCategory = (id) =>
  useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategory(id),
    enabled: !!id,
  });

// GET /api/categories/:id/products (products inside category)
export const useProductsByCategory = ({ id, page = 1, perPage = 10 } = {}) =>
  useQuery({
    queryKey: ["categories", id, "products", page, perPage],
    queryFn: () => getProductsByCategory({ id, page, perPage }),
    enabled: !!id,
    keepPreviousData: true,
  });

// Infinite-scroll version (optional)
export const useCategoriesInfinite = ({ perPage = 10 } = {}) =>
  useInfiniteQuery({
    queryKey: ["categories", "infinite"],
    queryFn: ({ pageParam = 1 }) => getCategories({ page: pageParam, perPage }),
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
  });

/* ---------- MUTATIONS ---------- */

// POST /api/admin/categories
export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

// PUT /api/admin/categories/:id
export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["categories", id] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// DELETE /api/admin/categories/:id
export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};
