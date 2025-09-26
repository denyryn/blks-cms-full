import { useAuth } from "@/contexts/auth.context";
import { Outlet, Navigate } from "react-router";

export default function AuthLayout() {
  const { isAdmin, isAuthenticated } = useAuth();

  if (isAdmin) return <Navigate to="/dashboard" replace />;
  if (!isAdmin && isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
