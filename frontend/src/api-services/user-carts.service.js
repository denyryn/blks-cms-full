import Fetcher from "@/lib/fetcher";

export function getCarts() {
  return Fetcher.fetch("/api/carts", {
    method: "GET",
  });
}

export function getCart(id) {
  return Fetcher.fetch(`/api/carts/${id}`, {
    method: "GET",
  });
}

export function createCart(id, { product_id, quantity }) {
  return Fetcher.fetch(`/api/carts/${id}`, {
    method: "POST",
    body: JSON.stringify({ product_id, quantity }),
  });
}

export function updateCart(id, { product_id, quantity }) {
  return Fetcher.fetch(`/api/carts/${id}`, {
    method: "PUT",
    body: JSON.stringify({ product_id, quantity }),
  });
}

export function deleteCart(id) {
  return Fetcher.fetch(`/api/carts/${id}`, {
    method: "DELETE",
  });
}
