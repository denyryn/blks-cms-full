import Fetcher from "@/lib/fetcher";

export async function getGuestMessages({ page = 1, perPage = 10 }) {
  return Fetcher.fetch(
    `/api/admin/guest-messages?page=${page}&perPage=${perPage}`,
    {
      method: "GET",
    }
  );
}

export async function getGuestMessage(id) {
  return Fetcher.fetch(`/api/admin/guest-messages/${id}`, {
    method: "GET",
  });
}

export async function createGuestMessage({ name, email, message }) {
  return Fetcher.fetch("/api/guest-messages", {
    method: "POST",
    body: JSON.stringify({ name, email, message }),
  });
}

export async function updateGuestMessage({ id, is_read }) {
  // Get CSRF cookie
  await Fetcher.csrf();

  return Fetcher.fetch(`/api/admin/guest-messages/${id}`, {
    method: "PUT",
    body: JSON.stringify({ is_read }),
  });
}

export async function deleteGuestMessage(id) {
  // Get CSRF cookie
  await Fetcher.csrf();
  return Fetcher.fetch(`/api/admin/guest-messages/${id}`, {
    method: "DELETE",
  });
}
