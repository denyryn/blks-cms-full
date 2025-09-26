import { getProducts, getProduct } from "@/api-services/products.service";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useProducts(
  initialPageIndex = 0,
  initialPageSize = 15,
  sort = null,
  categoryId = null
) {
  const [pagination, setPagination] = useState({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
    pageCount: -1,
  });

  const queryClient = useQueryClient();

  const queryKey = [
    "products",
    pagination.pageIndex,
    pagination.pageSize,
    sort,
    categoryId,
  ];

  const {
    data: queryData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { response, data: payload } = await getProducts({
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        sort: sort,
        category_id: categoryId,
      });

      if (!response.ok) {
        const msg = payload?.message || "Data failed to load.";
        toast.error(msg);
        throw new Error(msg);
      }

      if (payload?.message) toast.success(payload.message);

      return payload;
    },
    keepPreviousData: true, // Smooth pagination
    retry: false, // Avoid infinite retries if API consistently fails
  });

  // Sync pagination when data comes back
  useEffect(() => {
    if (queryData?.pagination) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: queryData.pagination.current_page - 1,
        pageSize: queryData.pagination.per_page,
        pageCount: queryData.pagination.last_page,
      }));
    }
  }, [queryData]);

  const pageRef = useRef(pagination);
  useEffect(() => {
    pageRef.current = pagination;
  }, [pagination]);

  // Keep same API as before
  const fetchLatest = useCallback(
    async (silent = false) => {
      const res = await refetch({ cancelRefetch: false });
      if (!silent && res.error) {
        toast.error(res.error.message || "Unexpected error.");
      }
      return res;
    },
    [refetch]
  );

  const refreshData = useCallback(() => fetchLatest(true), [fetchLatest]);

  return {
    data: queryData?.data || [],
    loading: isLoading,
    error: isError ? error?.message || "Unexpected error." : null,
    pagination,
    setPagination,
    refreshData,
    fetchLatest,
  };
}

export function useProduct(id) {
  const {
    data: queryData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;

      const { response, data: payload } = await getProduct(id);

      if (!response.ok) {
        const msg = payload?.message || "Product failed to load.";
        toast.error(msg);
        throw new Error(msg);
      }

      return payload?.data || payload;
    },
    enabled: !!id, // Only run query if id exists
    retry: false,
  });

  return {
    data: queryData,
    loading: isLoading,
    error: isError ? error?.message || "Unexpected error." : null,
    refetch,
  };
}
