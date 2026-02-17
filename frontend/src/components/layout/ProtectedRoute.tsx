import { Navigate } from "react-router";
import type { Role } from "../../_mock/mockUsers";

interface Props {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const raw = localStorage.getItem("currentUser");
  if (!raw) return <Navigate to="/login" replace />;

  const user = JSON.parse(raw);
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}