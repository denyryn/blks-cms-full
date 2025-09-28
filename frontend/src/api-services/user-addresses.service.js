import Fetcher from "@/lib/fetcher";

// Get all user addresses for the authenticated user
export function getUserAddresses() {
  return Fetcher.fetch("/api/user_addresses", {
    method: "GET",
  });
}

// Get the default address for the authenticated user
export function getUserDefaultAddress() {
  return Fetcher.fetch("/api/user_addresses", {
    method: "GET",
  });
}

// Create a new user address
export function createUserAddress(data) {
  return Fetcher.fetch("/api/user_addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Update an existing user address
export function updateUserAddress(id, data) {
  return Fetcher.fetch(`/api/user_addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Delete a user address
export function deleteUserAddress(id) {
  return Fetcher.fetch(`/api/user_addresses/${id}`, {
    method: "DELETE",
  });
}

// Set an address as default
export function setAddressAsDefault(addressId) {
  return Fetcher.fetch(`/api/user_addresses/${addressId}`, {
    method: "PATCH",
    body: JSON.stringify({ is_default: true }),
  });
}

// Get a specific user address
export function getUserAddress(addressId) {
  return Fetcher.fetch(`/api/user_addresses/${addressId}`, {
    method: "GET",
  });
}
