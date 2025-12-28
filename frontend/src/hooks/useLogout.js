
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logout } from "../redux/slices/profileSlice";
import { apiConnector } from "../services/apiConnector";
import { auth } from "../services/apis";

export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      const res = await apiConnector("POST", auth.LOG_OUT);

      if (res?.data?.success) {
        localStorage.setItem("logoutEvent", "true");

        // clear redux
        dispatch(logout());

        // clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("verifyEmailPending");
        localStorage.removeItem("verifyEmailFor");
        localStorage.removeItem("signupPayload");

        toast.success("Logged out successfully");
        navigate("/login", { replace: true });
      } else {
        toast.error("Logout failed");
      }
    } catch (err) {
      toast.error("Something went wrong during logout");
    }
  };

  return logoutUser;
}
