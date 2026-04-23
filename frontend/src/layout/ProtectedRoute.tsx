import { Navigate } from "react-router";
import type { Role } from "../types/RolesTypes";
import paths from "../routes/paths";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "../components/LoadingScreen";

interface Props {
    children: React.ReactNode;
    allowedRoles: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
    const { currentUser, initializing } = useAuth();

    // Wait for auth state
    if (initializing) return <LoadingScreen />;
    // Not logged in
    if (!currentUser) return <Navigate to={paths.login} replace />;

    // Normalize role strings to lowercase to prevent mismatch
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
    if (!normalizedAllowed.includes(currentUser.role.toLowerCase() as Role)) {
        return <Navigate to={paths.error.unauthorized} replace />;
    }

    return <>{children}</>;
}