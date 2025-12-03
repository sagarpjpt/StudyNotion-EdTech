import React, { useEffect, useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { apiConnector } from "../../../services/apiConnector";
import { profile, auth } from "../../../services/apis";
import { logout } from "../../../redux/slices/profileSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { VscDashboard } from "react-icons/vsc"
import { Link } from "react-router-dom";

const ProfileDropDown = () => {
  const [profileIcon, setProfileIcon] = useState();
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch user profile picture
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await apiConnector("GET", profile.GET_USER_DETAILS);
        if (res?.data?.success) {
          setProfileIcon(res.data.userDetails.image);
        }
      } catch (error) {
        console.error("Error fetching profile icon:", error);
      }
    };
    fetchUserDetails();
  }, []);

  // Logout function
  async function logoutUser() {
    try {
      const res = await apiConnector("POST", auth.LOG_OUT);
      if (res?.data?.success) {
        toast.success("Logged out successfully");
        // clear redux state
        dispatch(logout());
        // remove any local data
        localStorage.removeItem("verifyEmailPending");
        localStorage.removeItem("verifyEmailFor");
        localStorage.removeItem("signupPayload");
        navigate("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout");
    }
  }

  return (
    <div className="relative inline-block text-left">
      {/* Profile Icon */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer border border-richblack-600 rounded-full p-[2px] hover:border-yellow-50 transition-all duration-200"
      >
        <img
          src={profileIcon}
          alt="profile-icon"
          className="rounded-full w-7 h-7 object-cover"
        />
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-40 bg-richblack-800 border border-richblack-700 
          rounded-lg shadow-lg py-2 z-50 animate-fadeIn"
        >
          {/* dashboard link */}
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-3 px-4 py-2 text-sm text-richblack-25 hover:bg-richblack-700 hover:text-yellow-50 transition-all duration-150">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>

          {/* logout btn */}
          <button
            onClick={logoutUser}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-richblack-25 hover:bg-richblack-700 hover:text-yellow-50 transition-all duration-150"
          >
            <IoLogOut className="text-lg" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropDown;
