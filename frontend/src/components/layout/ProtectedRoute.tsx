import { Navigate } from "react-router";
import type { Role } from "../../types/RolesTypes";
import paths from "../../routes/paths";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../ui/LoadingScreen";

interface Props {
    children: React.ReactNode;
    allowedRoles: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
    const { user, initializing } = useAuth();

    if (initializing) return <LoadingScreen />;
    if (!user) return <Navigate to={paths.login} replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to={paths.error.unauthorized} replace />;

    return <>{children}</>;
}