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

export async function createOrder({ user_id, user_address_id, cart_ids }) {
  // Get CSRF cookie
  await Fetcher.csrf();
  return Fetcher.fetch("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      user_id,
      user_address_id,
      cart_ids,
    }),
  });
}

export async function updateOrder({ id, payment_proof }) {
  // Get CSRF cookie
  await Fetcher.csrf();
  const form = new FormData();
  form.append("_method", "PUT");
  form.append("payment_proof", payment_proof);
  return Fetcher.fetch(
    `/api/orders/${id}`,
    {
      method: "POST",
      body: form,
    },
    false
  );
}

export async function updateOrderStatus({ id, status }) {
  // Get CSRF cookie
  await Fetcher.csrf();
  return Fetcher.fetch(`/api/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      status,
    }),
  });
}
