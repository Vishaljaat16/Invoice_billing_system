import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const RoleGuard = ({ role, children }) => {

    const { user, loading } = useAuth();

    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (!user) {

        return <Navigate to="/login" replace />;

    }

    if (user.role !== role) {

        return <Navigate to="/unauthorized" replace />;

    }

    return children;

};

export default RoleGuard;