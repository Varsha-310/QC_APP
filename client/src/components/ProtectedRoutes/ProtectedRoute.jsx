import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children, redirectTo }) => {
  return isAuthenticated() ? (
    children
  ) : (
    <Navigate to={"/kyc-status"} replace={true} />
  );
};

export default ProtectedRoute;
