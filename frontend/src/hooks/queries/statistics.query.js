// src/hooks/queries/statistic.js
import { useQuery } from "@tanstack/react-query";
import {
  getOverviewStats,
  getDashboardStats,
  getUserStats,
  getProductStats,
  getOrderStats,
  getRevenueStats,
  getGuestMessageStats,
} from "@/api-services/statistics.service";

/* ---------- QUERIES ---------- */

// All stats are stale-while-revalidate every 30 s by default
const staleTime = 30 * 1000;

export const useOverviewStats = () =>
  useQuery({
    queryKey: ["stats", "overview"],
    queryFn: getOverviewStats,
    staleTime,
  });

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: getDashboardStats,
    staleTime,
  });

export const useUserStats = () =>
  useQuery({ queryKey: ["stats", "users"], queryFn: getUserStats, staleTime });

export const useProductStats = () =>
  useQuery({
    queryKey: ["stats", "products"],
    queryFn: getProductStats,
    staleTime,
  });

export const useOrderStats = () =>
  useQuery({
    queryKey: ["stats", "orders"],
    queryFn: getOrderStats,
    staleTime,
  });

export const useRevenueStats = () =>
  useQuery({
    queryKey: ["stats", "revenue"],
    queryFn: getRevenueStats,
    staleTime,
  });

export const useGuestMessageStats = () =>
  useQuery({
    queryKey: ["stats", "guest-messages"],
    queryFn: getGuestMessageStats,
    staleTime,
  });
