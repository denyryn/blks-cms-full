// src/hooks/queries/profile.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/api-services/profile.service";

/* ---------- QUERIES ---------- */

// GET /api/user/:id
export const useProfile = (id) =>
  useQuery({
    queryKey: ["profile", id],
    queryFn: () => getProfile(id),
    enabled: !!id,
  });

/* ---------- MUTATIONS ---------- */

// PUT /api/user/:id
export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["profile", id] });
    },
  });
};
