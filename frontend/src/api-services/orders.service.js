import Fetcher from "@/lib/fetcher";

export async function getOrders({ page = 1, perPage = 10 }) {
  return Fetcher.fetch(`/api/orders?page=${page}&per_page=${perPage}`, {
    method: "GET",
  });
}

export async function getOrder(id) {
  return Fetcher.fetch(`/api/orders/${id}`, {
    method: "GET",
  });
}

export async function createOrder({
  user_id,
  shipping_address_id,
  total_price,
  payment_proof,
  status,
}) {
  // Get CSRF cookie
  await Fetcher.csrf();
  return Fetcher.fetch("/api/admin/orders", {
    method: "POST",
    body: JSON.stringify({
      user_id,
      shipping_address_id,
      total_price,
      payment_proof,
      status,
    }),
  });
}

export async function updateOrder({
  id,
  user_id,
  shipping_address_id,
  total_price,
  payment_proof,
  status,
}) {
  // Get CSRF cookie
  await Fetcher.csrf();
  return Fetcher.fetch(`/api/admin/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      user_id,
      shipping_address_id,
      total_price,
      payment_proof,
      status,
    }),
  });
}
