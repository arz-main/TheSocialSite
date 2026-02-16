import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Paths from "../../routes/paths";

type ProtectedRouteProps = {
	children: ReactNode;
	allowedRoles: string[];
};

export default function ProtectedRoute({children, allowedRoles}: ProtectedRouteProps) {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to={Paths.login} replace />;
	}

	if (!allowedRoles.includes(user.role)) {
		return <Navigate to={Paths.unauthorized} replace />;
	}

	return <>{children}</>;
}
