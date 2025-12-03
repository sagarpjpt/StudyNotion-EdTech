// src/components/VerifyEmailRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

const VerifyEmailRoute = ({ children }) => {
  const location = useLocation();

  // check if came from signup page
  const fromSignup = location.state?.fromSignup

  if (fromSignup) {
    return children;
  }

  // otherwise, block access
  return <Navigate to="/signup" replace />;
};

export default VerifyEmailRoute;
