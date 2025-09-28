import { useState, useEffect, useCallback } from "react";
import { Fetcher } from "@/lib/fetcher";

// API functions (as helpers)
async function getProfile(id) {
  return Fetcher.fetch(`/api/user/${id}`, { method: "GET" });
}

async function updateProfile(id, { name, email, password, current_password }) {
  await Fetcher.csrf();
  return Fetcher.fetch(`/api/user/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, email, password, current_password }),
  });
}

// Hook
export function useProfile(id) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile(id);
      setProfile(data);
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Update profile
  const saveProfile = useCallback(
    async (updates) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await updateProfile(id, updates);
        setProfile(data); // refresh with updated profile
        return data;
      } catch (err) {
        setError(err.message || "Failed to update profile");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  // Auto-fetch if ID is provided
  useEffect(() => {
    if (id) fetchProfile();
  }, [id, fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    update: saveProfile,
  };
}
