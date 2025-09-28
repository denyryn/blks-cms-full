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

/* ---------- QUERIES (errors only) ---------- */

// GET /api/user_addresses (all addresses for auth user)
export const useUserAddresses = () =>
  useQuery({
    queryKey: ["user-addresses"],
    queryFn: async () => {
      const { data: json, response } = await getUserAddresses();
      if (!response.ok) {
        throw new Error(json.message || "Gagal memuat alamat");
      }
      return json.data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

// GET /api/user_addresses (default address)
export const useUserDefaultAddress = () =>
  useQuery({
    queryKey: ["user-addresses", "default"],
    queryFn: async () => {
      const { data: json, response } = await getUserDefaultAddress();
      if (!response.ok) {
        throw new Error(json.message || "Gagal memuat alamat default");
      }
      return json.data;
    },
    select: (data) => data.find((addr) => addr.is_default), // adapt if API already returns single
    onError: (error) => {
      toast.error(error.message);
    },
  });

// GET /api/user_addresses/:id (single)
export const useUserAddress = (id) =>
  useQuery({
    queryKey: ["user-addresses", id],
    queryFn: async () => {
      const { data: json, response } = await getUserAddress(id);
      if (!response.ok) {
        throw new Error(json.message || "Gagal memuat detail alamat");
      }
      return json.data;
    },
    enabled: !!id,
    onError: (error) => {
      toast.error(error.message);
    },
  });

/* ---------- MUTATIONS (success + error) ---------- */

// POST /api/user_addresses
export const useCreateUserAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUserAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-addresses"] });
      toast.success("Alamat berhasil ditambahkan");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menambahkan alamat");
    },
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
      toast.success("Alamat berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui alamat");
    },
  });
};

// DELETE /api/user_addresses/:id
export const useDeleteUserAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-addresses"] });
      toast.success("Alamat berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus alamat");
    },
  });
};

// PATCH /api/user_addresses/:id (set as default)
export const useSetAddressAsDefault = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: setAddressAsDefault,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-addresses"] });
      toast.success("Alamat utama berhasil diubah");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal mengubah alamat utama");
    },
  });
};
