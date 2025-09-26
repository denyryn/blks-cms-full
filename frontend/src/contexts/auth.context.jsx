import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { login, logout, check } from "@/api-services/auth.service";

const AuthCtx = createContext();

/* ------------------------------------------------------------------ */
/* Provider                                                           */
/* ------------------------------------------------------------------ */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null == not logged in
  const [loading, setLoading] = useState(true); // true until 1st check finishes
  const [busy, setBusy] = useState(false); // true while login/logout runs
  const [error, setError] = useState(null);

  /* ---------- silent re-check (used on mount and after login) ---------- */
  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { response, data } = await check();
      if (!response.ok) throw new Error(data?.message || "Unauthorized");
      setUser(data.data.user);
    } catch (e) {
      setUser(null);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------- register / login / logout ----------------------------------------- */
  const registerAuth = useCallback(
    async ({ email, password, password_confirmation }) => {
      setBusy(true);
      setError(null);
      try {
        await register({ email, password, password_confirmation });
        await checkAuth(); // sets user / error / loading
      } catch (e) {
        setError(e.message || "Registration failed");
      } finally {
        setBusy(false);
      }
    },
    [checkAuth]
  );

  const loginAuth = useCallback(
    async ({ email, password }) => {
      setBusy(true);
      setError(null);
      try {
        await login({ email, password });
        await checkAuth(); // sets user / error / loading
      } catch (e) {
        setError(e.message || "Login failed");
      } finally {
        setBusy(false);
      }
    },
    [checkAuth]
  );

  const logoutAuth = useCallback(async () => {
    setBusy(true);
    try {
      await logout();
      setUser(null);
    } finally {
      setBusy(false);
    }
  }, []);

  /* ---------- derived state ------------------------------------------ */
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isAdmin,
      loading, // page-level: true until we know who the user is
      busy, // button-level: true while login/logout runs
      error,
      register: registerAuth,
      login: loginAuth,
      logout: logoutAuth,
      check: checkAuth,
    }),
    [user, loading, busy, error, loginAuth, logoutAuth, checkAuth]
  );

  /* ---------- kick off initial check --------------------------------- */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */
export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

/**
 * Returns:
 *   true   – user has the role
 *   false  – user does not have the role
 *   undefined – we do not know yet (still loading)
 */
export const useRole = (role) => {
  const { user, loading } = useAuth();
  if (loading) return undefined;
  return user?.role === role;
};

/* ------------------------------------------------------------------ */
/* Render-prop helpers (optional)                                     */
/* ------------------------------------------------------------------ */
export const IfAuth = ({ children, fallback = null }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : fallback;
};

export const IfAdmin = ({ children, fallback = null }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : fallback;
};
