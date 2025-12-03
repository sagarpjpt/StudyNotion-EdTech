import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function PrivateRoute({ children }) {
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();

  useEffect(() => {
    const cameFromLogout = localStorage.getItem("logoutEvent");
    if (!user && !cameFromLogout) {
      toast.error("Please Log In To Access");
    }
    // clear flag
    localStorage.removeItem("logoutEvent");
  }, [user]);

  if (user) return children;

  // keep the location so you can redirect back after login (optional)
  return <Navigate to="/login" state={{ from: location }} replace />;
}



// replace prevents the user from going back to the protected route with browser back button.