import React from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../components/common/IconBtn.jsx";
import { apiConnector } from "../services/apiConnector.js";
import { resetPassword } from "../services/apis";
import { toast } from "react-hot-toast";
import Spinner from "../components/common/Spinner";
import { useNavigate } from "react-router-dom";


export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setLoading(true);

    try {
      const response = await apiConnector(
        "POST",
        resetPassword.RESET_PASSWORD_TOKEN,
        { email: data.email }
      );

      toast.success(response.data.message);
      navigate("/"); 
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
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
    <div className="flex justify-center items-center min-h-screen bg-richblack-900 px-4 fadeIn">
      <div className="w-full max-w-md bg-richblack-800 rounded-xl p-8 shadow-lg">

        {/* Header */}
        <h2 className="text-3xl font-semibold text-richblack-5 mb-2">
          Reset Your Password
        </h2>
        <p className="text-richblack-200 mb-6 text-sm">
          Enter your email and we will send you a link to reset your password.
        </p>

        {/* FORM (React Hook Form) */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-richblack-5 text-sm">Email Address</label>

            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5 border border-richblack-600 focus:border-yellow-50 outline-none transition"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Enter a valid email",
                },
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Button */}
          <IconBtn
            text="Send Reset Link"
            type="submit"
            customClasses="w-full justify-center"
          />
        </form>
      </div>

      {/* FADE IN ANIMATION */}
      <style>
        {`
        .fadeIn {
          animation: fade 0.4s ease-out;
        }
        @keyframes fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </div>
  );
}
