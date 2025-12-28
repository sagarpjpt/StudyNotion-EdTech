import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/slices/profileSlice";
import { apiConnector } from "../../../services/apiConnector";
import { auth } from "../../../services/apis";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const GoogleAuthButton = ({ formtype }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [accountType, setAccountType] = useState("Student");

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await apiConnector("POST", auth.O_AUTH_GOOGLE, {
          access_token: tokenResponse.access_token,
          accountType,
          mode: formtype,
        });

        if (res?.data?.success) {
          localStorage.setItem("token", res.data.token);
          dispatch(setUser(res.data.user));
          toast.success(
            res.data.message || `Logged in with Google`
          );
          navigate("/");
        }
      } catch (error) {
        console.log("Google auth failed", error);
        toast.error("Google auth failed");
      }
    },
    onError: () => {
      console.log("Google Login Failed");
      toast.error("Google Login Failed");
    },
  });

  return (
    <>
      {/* Google button */}
      <button
        onClick={() => {
          if (formtype === "signup") {
            setShowRolePopup(true);
          } else {
            loginWithGoogle();
          }
        }}
        className="w-full flex justify-center items-center 
        rounded-[8px] font-medium text-custom-text border border-richblack-700 
        px-[12px] py-[8px] gap-x-2 mt-6 capitalize cursor-pointer"
      >
        <FcGoogle />
        {formtype === "signup" ? "sign up with google" : "sign in with google"}
      </button>

      {/* Role popup */}
      {showRolePopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 rounded-md">
          <div className="bg-richblack-800 p-6 rounded-lg w-[300px]">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Select account type
            </h3>

            <div className="flex flex-col gap-3">
              <label className="text-white">
                <input
                  type="radio"
                  name="role"
                  value="Student"
                  checked={accountType === "Student"}
                  onChange={() => setAccountType("Student")}
                />{" "}
                Student
              </label>

              <label className="text-white">
                <input
                  type="radio"
                  name="role"
                  value="Instructor"
                  checked={accountType === "Instructor"}
                  onChange={() => setAccountType("Instructor")}
                />{" "}
                Instructor
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRolePopup(false)}
                className="px-4 py-1 bg-richblack-600 rounded hover:bg-richblack-500 text-white cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowRolePopup(false);
                  loginWithGoogle();
                }}
                className="px-4 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-300 font-medium cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthButton;
