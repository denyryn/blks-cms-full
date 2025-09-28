import Fetcher from "@/lib/fetcher";

export async function getProducts({
  page = 1,
  perPage = 10,
  sort,
  category_id,
  search,
}) {
  let url = `/api/products?page=${page}&per_page=${perPage}`;

  if (sort) {
    url += `&sort=${sort}`;
  }

  if (category_id && category_id !== "all") {
    url += `&category_id=${category_id}`;
  }

  if (search) {
    url += `&search=${search}`;
  }

  return Fetcher.fetch(url, {
    method: "GET",
  });
}

export async function getProduct(id) {
  return Fetcher.fetch(`/api/products/${id}`, {
    method: "GET",
  });
}

export async function createProduct({
  category_id,
  name,
  description,
  image,
  price,
}) {
  // Get CSRF cookie
  await Fetcher.csrf();
  const form = new FormData();
  form.append("category_id", category_id);
  form.append("name", name);
  form.append("description", description);
  form.append("image", image);
  form.append("price", price);
  return Fetcher.fetch(
    "/api/admin/products",
    {
      method: "POST",
      body: form,
    },
    false
  );
}

export async function updateProduct({
  id,
  category_id,
  name,
  description,
  image,
  price,
}) {
  // Get CSRF cookie
  await Fetcher.csrf();
  const form = new FormData();
  form.append("_method", "PUT");
  form.append("category_id", category_id);
  form.append("name", name);
  form.append("description", description);
  form.append("price", price);

  if (image instanceof File) {
    form.append("image", image);
  }

  return Fetcher.fetch(
    `/api/admin/products/${id}`,
    {
      method: "POST",
      body: form,
    },
    false
  );
}

export async function deleteProduct(id) {
  return Fetcher.fetch(`/api/admin/products/${id}`, {
    method: "DELETE",
  });
}
