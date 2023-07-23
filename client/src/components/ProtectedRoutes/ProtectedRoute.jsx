import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children, redirectTo }) => {
  return isAuthenticated() ? children : <Navigate to={"/"} />;
};

export default ProtectedRoute;
