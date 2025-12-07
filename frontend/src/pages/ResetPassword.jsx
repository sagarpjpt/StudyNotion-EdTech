import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { resetPassword } from "../services/apis";
import Spinner from "../components/common/Spinner";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  // console.log("Token:", token, "UserID:", userId);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPasswordValue = watch("newPassword", "");

  function calculatePasswordStrength(pw) {
    if (!pw) return 0;
    const conditions = [
      /.{8,20}/.test(pw),
      /[A-Z]/.test(pw),
      /[a-z]/.test(pw),
      /[0-9]/.test(pw),
      /[^A-Za-z0-9]/.test(pw),
    ];
    return conditions.filter(Boolean).length;
  }
  function updateStrength(pw) {
    setStrength(calculatePasswordStrength(pw));
  }

  async function onSubmit(data) {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await apiConnector("POST", resetPassword.RESET_PASSWORD, {
        token,
        userId,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-richblack-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-richblack-900 px-4 fadeIn text-richblack-5">
      <div className="w-full max-w-md bg-richblack-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-semibold text-richblack-5 mb-2">
          Reset Your Password
        </h2>
        <p className="text-sm text-richblack-200 mb-6">
          Enter your new password below.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          {/* New Password */}
          <label className="w-full">
            <p className="text-[1rem] mb-1 leading-[1.375rem]">
              New Password <sup className="text-red-500">*</sup>
            </p>
            <div className="relative min-h-[44px]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="bg-richblack-700 w-full rounded-lg p-[12px] border border-richblack-600 focus:border-yellow-50 outline-none pr-12"
                {...register("newPassword", {
                  required: "Password is required",
                  validate: {
                    length: (v) =>
                      (v && v.length >= 8 && v.length <= 20) ||
                      "Password must be 8-20 characters long",
                    uppercase: (v) =>
                      /[A-Z]/.test(v) || "Must contain an uppercase letter",
                    lowercase: (v) =>
                      /[a-z]/.test(v) || "Must contain a lowercase letter",
                    number: (v) => /\d/.test(v) || "Must contain a number",
                    special: (v) =>
                      /[^A-Za-z0-9]/.test(v) ||
                      "Must contain a special character",
                    noSpaces: (v) =>
                      !/\s/.test(v) || "Password cannot contain spaces",
                  },
                  onChange: (e) => updateStrength(e.target.value),
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </label>

          {/* Confirm Password */}
          <label className="w-full">
            <p className="text-[1rem] mb-1 leading-[1.375rem]">
              Confirm Password <sup className="text-red-500">*</sup>
            </p>
            <div className="relative min-h-[44px]">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                className="bg-richblack-700 w-full rounded-lg p-[12px] border border-richblack-600 focus:border-yellow-50 outline-none pr-12"
                {...register("confirmNewPassword", {
                  required: "Confirmation is required",
                  validate: (v) =>
                    v === watch("newPassword") || "Passwords must match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
              >
                {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </label>

          {/* PASSWORD STRENGTH BAR SAME AS SIGNUP */}
          <div className="mt-2 w-full">
            <div className="h-2 w-full bg-richblack-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(strength / 5) * 100}%`,
                  backgroundColor:
                    strength <= 2 ? "red" : strength === 3 ? "orange" : "green",
                }}
              ></div>
            </div>

            {newPasswordValue && (
              <p className="text-sm mt-1 text-richblack-200">
                {strength <= 2
                  ? "Weak Password"
                  : strength === 3
                  ? "Medium Strength"
                  : "Strong Password"}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button className="w-full bg-yellow-50 py-2 rounded-lg text-richblack-900 font-semibold mt-4">
            Reset Password
          </button>
        </form>
      </div>

      {/* Animations */}
      <style>
        {`
          .fadeIn {
            animation: fadeIn 0.4s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
