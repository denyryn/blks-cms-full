import * as stats from "@/api-services/statistics.service";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

export function useStatistics({ type = "overview" }) {
  const getStats = (type) => {
    switch (type) {
      case "overview":
        return stats.getOverviewStats;
      case "dashboard":
        return stats.getDashboardStats;
      case "users":
        return stats.getUserStats;
      case "products":
        return stats.getProductStats;
      case "orders":
        return stats.getOrderStats;
      case "revenue":
        return stats.getRevenueStats;
      case "guest-messages":
        return stats.getGuestMessageStats;
      default:
        return stats.getOverviewStats;
    }
  };

  const {
    data: queryData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["statistics", type],
    queryFn: async () => {
      const statsFn = getStats(type);
      const { response, data: payload } = await statsFn();

      if (!response.ok) {
        throw new Error(payload?.message || "Failed to load statistics");
      }

      return payload;
    },
    retry: false,
  });

  const fetchLatest = useCallback(() => refetch(), [refetch]);

  return {
    data: queryData?.data || null,
    loading: isLoading,
    error: isError ? error?.message || "Unexpected error." : null,
    fetchLatest,
  };
}
