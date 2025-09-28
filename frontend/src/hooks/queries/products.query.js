// src/hooks/queries/product.js
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api-services/products.service";
import { toast } from "sonner";

/* ---------- QUERIES (errors only) ---------- */

// GET /api/products (filterable & paginated)
export const useProducts = ({
  page = 1,
  perPage = 10,
  sort,
  category_id,
  search,
} = {}) =>
  useQuery({
    queryKey: ["products", page, perPage, sort, category_id, search],
    queryFn: async () => {
      const { response, data: json } = await getProducts({
        page,
        perPage,
        sort,
        category_id,
        search,
      });
      if (!response.ok) {
        throw new Error(json.message || "Gagal memuat produk");
      }
      return json.data;
    },
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message);
    },
  });

// GET /api/products/:id (single product)
export const useProduct = (id) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { response, data: json } = await getProduct(id);
      if (!response.ok) {
        throw new Error(json.message || "Gagal memuat produk");
      }
      return json.data;
    },
    enabled: !!id,
    onError: (error) => {
      toast.error(error.message);
    },
  });

// Infinite-scroll version
export const useProductsInfinite = ({ perPage = 10, sort, category_id } = {}) =>
  useInfiniteQuery({
    queryKey: ["products", "infinite", sort, category_id],
    queryFn: async ({ pageParam = 1 }) => {
      const { response, data: json } = await getProducts({
        page: pageParam,
        perPage,
        sort,
        category_id,
      });
      if (!response.ok) {
        throw new Error(json.message || "Gagal memuat produk");
      }
      return json;
    },
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
    onError: (error) => {
      toast.error(error.message);
    },
  });

/* ---------- MUTATIONS (success + error) ---------- */

// POST /api/admin/products (FormData)
export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil dibuat");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal membuat produk");
    },
  });
};

// POST /api/admin/products/:id (FormData with _method=PUT)
export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["products", id] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui produk");
    },
  });
};

// DELETE /api/admin/products/:id
export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus produk");
    },
  });
};
