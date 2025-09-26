import Fetcher from "@/lib/fetcher";

export async function register({ email, password, password_confirmation }) {
  // Get CSRF cookie
  await Fetcher.csrf();

  // Register
  return Fetcher.fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, password_confirmation }),
  });
}

export async function login({ email, password }) {
  // Get CSRF cookie
  await Fetcher.csrf();

  // Login
  return Fetcher.fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return Fetcher.fetch("/api/auth/logout", {
    credentials: "include",
    method: "POST",
  });
}

export async function check() {
  return Fetcher.fetch("/api/auth/me", {
    credentials: "include",
    method: "GET",
  });
}
