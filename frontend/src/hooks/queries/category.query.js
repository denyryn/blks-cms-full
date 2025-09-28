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

/* ---------- QUERIES (errors only) ---------- */

// GET /api/categories (paginated list)
export const useCategories = ({ page = 1, perPage = 10 } = {}) =>
  useQuery({
    queryKey: ["categories", page, perPage],
    queryFn: async () => {
      const { response, data: json } = await getCategories({ page, perPage });
      if (!response.ok) {
        throw new Error(json.message || "Gagal memuat kategori");
      }
      return json.data;
    },
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message);
    },
  });

// GET /api/categories/:id (single category)
export const useCategory = (id) =>
  useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const { response, data: json } = await getCategory(id);
      if (!response.ok) {
        throw new Error(json.message || "Gagal memuat kategori");
      }
      return json.data;
    },
    enabled: !!id,
    onError: (error) => {
      toast.error(error.message);
    },
  });

// GET /api/categories/:id/products (products inside category)
export const useProductsByCategory = ({ id, page = 1, perPage = 10 } = {}) =>
  useQuery({
    queryKey: ["categories", id, "products", page, perPage],
    queryFn: async () => {
      const { response, data: json } = await getProductsByCategory({
        id,
        page,
        perPage,
      });
      if (!response.ok) {
        throw new Error(json.message || "Gagal memuat produk dalam kategori");
      }
      return json.data;
    },
    enabled: !!id,
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message);
    },
  });

// Infinite-scroll version
export const useCategoriesInfinite = ({ perPage = 10 } = {}) =>
  useInfiniteQuery({
    queryKey: ["categories", "infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      const { response, data: json } = await getCategories({
        page: pageParam,
        perPage,
      });
      if (!response.ok) {
        throw new Error(json.message || "Gagal memuat kategori");
      }
      return json;
    },
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
    onError: (error) => {
      toast.error(error.message);
    },
  });

/* ---------- MUTATIONS (success + error) ---------- */

// POST /api/admin/categories
export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil dibuat");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal membuat kategori");
    },
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
      toast.success("Kategori berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui kategori");
    },
  });
};

// DELETE /api/admin/categories/:id
export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus kategori");
    },
  });
};
