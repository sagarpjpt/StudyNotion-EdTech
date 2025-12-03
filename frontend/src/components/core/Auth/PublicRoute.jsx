// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute({ children }) {
  const { user } = useSelector((state) => state.profile);

  if (user) {
    // if user is already logged in, redirect to home/dashboard
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
