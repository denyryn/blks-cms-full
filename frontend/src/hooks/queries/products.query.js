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

/* ---------- QUERIES ---------- */

// GET /api/products (filterable & paginated)
export const useProducts = ({
  page = 1,
  perPage = 10,
  sort,
  category_id,
} = {}) =>
  useQuery({
    queryKey: ["products", page, perPage, sort, category_id],
    queryFn: async () => {
      const { response, data: json } = await getProducts({
        page,
        perPage,
        sort,
        category_id,
      });
      if (!response.ok) toast.error(json.message || "Gagal memuat produk");
      return json.data;
    },
    keepPreviousData: true,
  });

// GET /api/products/:id (single product)
export const useProduct = (id) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

// Infinite-scroll version (optional)
export const useProductsInfinite = ({ perPage = 10, sort, category_id } = {}) =>
  useInfiniteQuery({
    queryKey: ["products", "infinite", sort, category_id],
    queryFn: ({ pageParam = 1 }) =>
      getProducts({ page: pageParam, perPage, sort, category_id }),
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
  });

/* ---------- MUTATIONS ---------- */

// POST /api/admin/products (FormData)
export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
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
    },
  });
};

// DELETE /api/admin/products/:id
export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};
