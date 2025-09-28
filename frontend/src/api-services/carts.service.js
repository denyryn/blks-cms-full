import Fetcher from "@/lib/fetcher";

export async function getCarts() {
  return Fetcher.fetch(`/api/admin/carts`, {
    method: "GET",
  });
}

export default function clearCart() {
  return Fetcher.fetch(`/api/admin/carts`, {
    method: "DELETE",
  });
}
