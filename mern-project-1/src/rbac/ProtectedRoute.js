import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Check if the logged user's role is part of allowed roles array coming as prop.
// If yes, render children, otherwise navigate to unauthorized access page.
function ProtectedRoute({ roles, children }) {
    const user = useSelector((state) => state.userDetails);
    return roles.includes(user?.role) ?
        children :
        <Navigate to="/unauthorized-access" />;
}

export default ProtectedRoute;