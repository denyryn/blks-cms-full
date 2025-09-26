import Fetcher from "@/lib/fetcher";

export async function getCarts() {
  return Fetcher.fetch(`/api/admin/carts`, {
    method: "GET",
  });
}

export function getCart(id) {
  return Fetcher.fetch(`/api/admin/carts/${id}`, {
    method: "GET",
  });
}
