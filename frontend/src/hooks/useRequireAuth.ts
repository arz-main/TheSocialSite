import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import paths from "../routes/paths";

// use this to delay user requests
export const useRequireAuth = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    return (action: () => void) => {
        if (!currentUser) {
            navigate(paths.login);
            return;
        }
        action();
    };
};