// src/hooks/queries/auth.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { register, login, logout, check } from "@/api-services/auth.service";
import { toast } from "sonner";

/* ---------- QUERIES (errors only) ---------- */

// GET /api/auth/me (current user)
export const useAuth = () =>
  useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data: json, response } = await check();
      if (!response.ok) {
        throw new Error(json.message || "Gagal memuat data pengguna");
      }
      return json.data.user;
    },
    retry: false, // don’t refetch on 401
    onError: (error) => {
      toast.error(error.message);
    },
  });

/* ---------- MUTATIONS (success + error) ---------- */

// POST /api/auth/register
export const useRegister = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Registrasi berhasil");
    },
    onError: (error) => {
      toast.error(error.message || "Registrasi gagal");
    },
  });
};

// POST /api/auth/login
export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Login berhasil");
    },
    onError: (error) => {
      toast.error(error.message || "Login gagal");
    },
  });
};

// POST /api/auth/logout
export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Logout berhasil");
    },
    onError: (error) => {
      toast.error(error.message || "Logout gagal");
    },
  });
};
