import Fetcher from "@/lib/fetcher";

export async function getUsers() {
  return Fetcher.fetch(`/api/admin/users`, {
    method: "GET",
  });
}

export async function getUser(id) {
  return Fetcher.fetch(`/api/admin/users/${id}`, {
    method: "GET",
  });
}

export async function updateUser({ id, name, email, role }) {
  // Get CSRF cookie
  await Fetcher.csrf();
  return Fetcher.fetch(`/api/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, email, role }),
  });
}

export async function deleteUser(id) {
  // Get CSRF cookie
  await Fetcher.csrf();
  return Fetcher.fetch(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
}
