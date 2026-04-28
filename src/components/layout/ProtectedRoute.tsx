import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, homeForRole } from "@/hooks/useAuth";
import AppShell from "./AppShell";
import { Role } from "@/api/types";

export default function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: Role[] }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to={homeForRole(user.role)} replace />;
  return <AppShell>{children}</AppShell>;
}
