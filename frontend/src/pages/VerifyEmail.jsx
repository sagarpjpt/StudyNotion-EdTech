import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { auth } from "../services/apis";
import toast from "react-hot-toast";
import Spinner from "../components/common/Spinner";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow numeric values
    if (!/^[0-9]?$/.test(value)) return; // RegExp.prototype.test() checks if a given string matches the pattern.

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    // get data passed from signup or from localStorage fallback
    const signupPayload =
      location.state?.signupPayload ||
      JSON.parse(localStorage.getItem("signupPayload"));

    if (!signupPayload) {
      toast.error("Signup data not found. Please sign up again.");
      navigate("/signup");
      return;
    }

    // attach OTP to signup data
    const finalPayload = { ...signupPayload, otp: code };

    try {
      setLoading(true);
      const res = await apiConnector("POST", auth.SIGNUP, finalPayload);

      if (res?.data?.success) {
        toast.success("Email verified and account created successfully!");

        // Clear temporary data
        localStorage.removeItem("verifyEmailPending");
        localStorage.removeItem("verifyEmailFor");
        localStorage.removeItem("signupPayload");

        // Redirect to login
        navigate("/login");
      } else {
        toast.error(res?.data?.message || "Verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to verify email. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-richblack-900 text-richblack-5">
      <form
        onSubmit={handleSubmit}
        className="bg-richblack-800 rounded-lg p-8 flex flex-col items-center gap-6 w-[90%] max-w-md shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-yellow-25">Verify Email</h1>
        <p className="text-center text-richblack-200 text-sm">
          A 6-digit verification code has been sent to your email.  
          Please enter it below to verify your account.
        </p>

        {/* OTP Input Boxes */}
        <div className="flex gap-3 justify-center w-11/12">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(current_inp_field) => (inputsRef.current[index] = current_inp_field)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 lg:w-12 h-12 text-center text-lg font-semibold rounded-md border border-richblack-600 bg-richblack-700 focus:border-yellow-50 focus:outline-none"
            />
          ))}
        </div>

        <button className="text-center text-[13px] px-6 py-3 rounded-md font-bold transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-105 bg-yellow-100 text-black cursor-pointer">
            Verify Email
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
