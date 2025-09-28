import Fetcher from "@/lib/fetcher";

export async function getProfile(id) {
  return Fetcher.fetch(`/api/user/${id}`, {
    method: "GET",
  });
}

export async function updateProfile({
  id,
  name,
  email,
  password,
  current_password,
}) {
  // Get CSRF cookie
  await Fetcher.csrf();
  return Fetcher.fetch(`/api/user/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, email, password, current_password }),
  });
}
