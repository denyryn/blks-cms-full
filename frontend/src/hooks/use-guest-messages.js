import { getGuestMessages } from "@/api-services/guest-message.service";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export function useGuestMessages(initialPageIndex = 0, initialPageSize = 10) {
  const [pagination, setPagination] = useState({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
    pageCount: -1, // -1 indicates unknown page count initially
  });

  const queryKey = [
    "guest-messages",
    pagination.pageIndex,
    pagination.pageSize,
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
      const { response, data: payload } = await getGuestMessages({
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
      });

      if (!response.ok) {
        const msg = payload?.message || "Data failed to load.";
        toast.error(msg);
        throw new Error(msg);
      }

      if (payload?.message) toast.success(payload.message);

      return payload;
    },
    keepPreviousData: true,
    retry: false,
  });

  // sync pagination when data changes
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

  // maintain ref for imperative fetch
  const pageRef = useRef(pagination);
  useEffect(() => {
    pageRef.current = pagination;
  }, [pagination]);

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
