import Fetcher from "@/lib/fetcher";

export async function getOverviewStats() {
  return Fetcher.fetch("/api/admin/statistics/overview", {
    credentials: "include",
    method: "GET",
  });
}

export async function getDashboardStats() {
  return Fetcher.fetch("/api/admin/statistics/dashboard", {
    credentials: "include",
    method: "GET",
  });
}

export async function getUserStats() {
  return Fetcher.fetch("/api/admin/statistics/users", {
    credentials: "include",
    method: "GET",
  });
}

export async function getProductStats() {
  return Fetcher.fetch("/api/admin/statistics/products", {
    credentials: "include",
    method: "GET",
  });
}

export async function getOrderStats() {
  return Fetcher.fetch("/api/admin/statistics/orders", {
    credentials: "include",
    method: "GET",
  });
}

export async function getRevenueStats() {
  return Fetcher.fetch("/api/admin/statistics/revenue", {
    credentials: "include",
    method: "GET",
  });
}

export async function getGuestMessageStats() {
  return Fetcher.fetch("/api/admin/statistics/guest-messages", {
    credentials: "include",
    method: "GET",
  });
}
