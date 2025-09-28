// src/hooks/queries/userAddress.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserAddresses,
  getUserDefaultAddress,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setAddressAsDefault,
  getUserAddress,
} from "@/api-services/user-addresses.service";
import { toast } from "sonner";

/* ---------- QUERIES ---------- */

// GET /api/user_addresses (all addresses for auth user)
export const useUserAddresses = () =>
  useQuery({
    queryKey: ["user-addresses"],
    queryFn: async () => {
      const { data: json, response } = await getUserAddresses();
      if (!response.ok) toast.error(json.message);
      return json.data;
    },
  });

// GET /api/user_addresses (default address)
export const useUserDefaultAddress = () =>
  useQuery({
    queryKey: ["user-addresses", "default"],
    queryFn: async () => {
      const { data: json, response } = await getUserDefaultAddress();
      if (!response.ok) toast.error(json.message);
      return json.data;
    },
    select: (data) => data.find((addr) => addr.is_default), // adapt if endpoint already filters
  });

// GET /api/user_addresses/:id (single)
export const useUserAddress = (id) =>
  useQuery({
    queryKey: ["user-addresses", id],
    queryFn: () => getUserAddress(id),
    enabled: !!id,
  });

/* ---------- MUTATIONS ---------- */

// POST /api/user_addresses
export const useCreateUserAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUserAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-addresses"] }),
  });
};

// PUT /api/user_addresses/:id
export const useUpdateUserAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUserAddress(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["user-addresses", id] });
      qc.invalidateQueries({ queryKey: ["user-addresses"] });
    },
  });
};

// DELETE /api/user_addresses/:id
export const useDeleteUserAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-addresses"] }),
  });
};

// PATCH /api/user_addresses/:id (set as default)
export const useSetAddressAsDefault = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: setAddressAsDefault,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-addresses"] }),
  });
};
