import Fetcher from "@/lib/fetcher";

export async function getCategories({ page = 1, perPage = 10 }) {
  return Fetcher.fetch(`/api/categories?page=${page}&per_page=${perPage}`, {
    method: "GET",
  });
}

export async function getCategory(id) {
  return Fetcher.fetch(`/api/categories/${id}`, {
    method: "GET",
  });
}

export async function getProductsByCategory({ id, page = 1, perPage = 10 }) {
  return Fetcher.fetch(
    `/api/categories/${id}/products?page=${page}&per_page=${perPage}`,
    {
      method: "GET",
    }
  );
}

export async function createCategory({ name }) {
  // Get CSRF cookie
  await Fetcher.csrf();
  return Fetcher.fetch("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateCategory({ id, name }) {
  // Get CSRF cookie
  await Fetcher.csrf();
  return Fetcher.fetch(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export async function deleteCategory(id) {
  return Fetcher.fetch(`/api/admin/categories/${id}`, {
    method: "DELETE",
  });
}
