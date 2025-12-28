import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute({ children }) {
  const { user } = useSelector((state) => state.profile);
  const token = localStorage.getItem("token");

  // if already authenticated, block access to public pages
  if (user || token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
