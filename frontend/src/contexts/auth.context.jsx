import React, { createContext, useContext, useMemo } from "react";
import {
  useAuth as useRQAuth,
  useLogin,
  useLogout,
  useRegister,
} from "@/hooks/queries/auths.query";
import { toast } from "sonner";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  /* ---------- cached user (RQ) ---------- */
  const { data: user, isLoading: loading, error } = useRQAuth(); // key: ["auth", "me"]

  /* ---------- mutations ---------- */
  const { mutateAsync: loginMut, isPending: loginBusy } = useLogin();
  const { mutateAsync: logoutMut, isPending: logoutBusy } = useLogout();
  const { mutateAsync: registerMut, isPending: registerBusy } = useRegister();

  const busy = loginBusy || logoutBusy || registerBusy;

  /* ---------- thin wrappers that toast ---------- */
  const loginAuth = React.useCallback(
    async (vars) => {
      try {
        await loginMut(vars);
        toast.success("Login successful");
      } catch (e) {
        toast.error(e.message || "Login failed");
        throw e; // let caller catch if needed
      }
    },
    [loginMut]
  );

  const logoutAuth = React.useCallback(async () => {
    try {
      await logoutMut();
      toast.success("Logout successful");
    } catch (e) {
      toast.error(e.message || "Logout failed");
      throw e;
    }
  }, [logoutMut]);

  const registerAuth = React.useCallback(
    async (vars) => {
      try {
        await registerMut(vars);
        toast.success("Registration successful");
      } catch (e) {
        toast.error(e.message || "Registration failed");
        throw e;
      }
    },
    [registerMut]
  );

  /* ---------- derived ---------- */
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isAdmin,
      loading,
      busy,
      error,
      login: loginAuth,
      logout: logoutAuth,
      register: registerAuth,
    }),
    [user, loading, busy, error, loginAuth, logoutAuth, registerAuth]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

/* ------------------------------------------------------------------ */
/* hooks                                                              */
/* ------------------------------------------------------------------ */
export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const useRole = (role) => {
  const { user, loading } = useAuth();
  if (loading) return undefined;
  return user?.role === role;
};

/* ------------------------------------------------------------------ */
/* render-prop helpers (optional)                                     */
/* ------------------------------------------------------------------ */
export const IfNotAuth = ({ children, fallback = null }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : fallback;
};

export const IfAuth = ({ children, fallback = null }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : fallback;
};

export const IfAdmin = ({ children, fallback = null }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : fallback;
};
