import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import AuthCheckingComponent from "../Alert/AuthCheckingComponent";

const AuthRoute = ({ children }) => {
  const location = useLocation(); // help us to get the location where the user is coming from
  const { isAuthenticated, isLoading, isError } = useAuth();
  if (isLoading) {
    return <AuthCheckingComponent />;
  }
  if (isError || isAuthenticated === false) {
    return <Navigate to="/login" state={{ from: location }} replace />; // replace means we return back to /login by skipping all the intermediate pages
  }
  return children; // user login is authenticated
};

export default AuthRoute;