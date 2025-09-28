import React, { createContext, useContext, useMemo, useCallback } from "react";
import {
  useAuth as useRQAuth,
  useLogin,
  useLogout,
  useRegister,
} from "@/hooks/queries/auths.query";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  /* ---------- cached user (RQ) ---------- */
  const { data: user, isLoading: loading, error } = useRQAuth(); // queryKey: ["auth", "me"]

  /* ---------- mutations ---------- */
  const { mutateAsync: loginMut, isPending: loginBusy } = useLogin();
  const { mutateAsync: logoutMut, isPending: logoutBusy } = useLogout();
  const { mutateAsync: registerMut, isPending: registerBusy } = useRegister();

  const busy = loginBusy || logoutBusy || registerBusy;

  /* ---------- thin wrappers (no toast here) ---------- */
  const loginAuth = useCallback((vars) => loginMut(vars), [loginMut]);
  const logoutAuth = useCallback(() => logoutMut(), [logoutMut]);
  const registerAuth = useCallback((vars) => registerMut(vars), [registerMut]);

  /* ---------- derived ---------- */
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  /* ---------- memoized value ---------- */
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
  if (loading) return undefined; // caller can handle spinner state
  return user?.role === role;
};

/* ------------------------------------------------------------------ */
/* render-prop helpers                                                 */
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
