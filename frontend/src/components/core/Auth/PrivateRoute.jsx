import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../../../redux/slices/profileSlice";

export default function PrivateRoute({ children }) {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const location = useLocation();
  const toastShown = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cameFromLogout = localStorage.getItem("logoutEvent");

    // No token
    if (!token) {
      // show toast ONLY if not logout
      if (!cameFromLogout && !toastShown.current) {
        toast.error("Please log in to access");
        toastShown.current = true;
      }

      // clear logout flag safely
      localStorage.removeItem("logoutEvent");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Token expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        dispatch(setUser(null));

        if (!toastShown.current) {
          toast.error("Session expired. Please log in again.");
          toastShown.current = true;
        }
      }

      // Restore redux user after refresh
      if (!user) {
        dispatch(setUser(decoded));
      }
    } catch (err) {
      // invalid token
      localStorage.removeItem("token");
      dispatch(setUser(null));

      if (!toastShown.current) {
        toast.error("Authentication failed. Please log in again.");
        toastShown.current = true;
      }
    }
  }, [user, dispatch]);

  // Final route guard
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
