import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../../../services/apiConnector";
import { auth } from "../../../services/apis";
import { useForm } from "react-hook-form";

function SignupForm({ setLoading }) {
  const [isStudent, setIsStudent] = useState(true);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [strength, setStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch("password", "");

  function calculatePasswordStrength(pw) {
    if (!pw) return 0;
    const conditions = [
      /.{8,20}/.test(pw),
      /[A-Z]/.test(pw),
      /[a-z]/.test(pw),
      /[0-9]/.test(pw),
      /[^A-Za-z0-9]/.test(pw),
    ];
    return conditions.filter(Boolean).length; // 0..5
  }

  function updateStrength(pw) {
    setStrength(calculatePasswordStrength(pw));
  }

  async function onSubmit(data) {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const accountType = isStudent ? "Student" : "Instructor";
    const finalData = { ...data, accountType };

    try {
      setLoading(true);

      const res = await apiConnector("POST", auth.SEND_OTP, {
        email: finalData.email,
      });

      if (res?.data?.success) {
        toast.success(res.data.message || "OTP sent to your email");

        localStorage.setItem("verifyEmailPending", "true");
        localStorage.setItem("verifyEmailFor", finalData.email);
        localStorage.setItem("signupPayload", JSON.stringify(finalData));

        navigate("/verify-email", {
          state: {
            fromSignup: true,
            email: finalData.email,
            signupPayload: finalData,
          },
        });
      } else {
        toast.error(res?.data?.message || "Could not send OTP");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to send OTP. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-x-hidden">
      {/* Student / Instructor Switch */}
      <div className="w-fit flex mt-6 bg-richblack-800 p-[0.25rem] rounded-full">
        <button
          type="button"
          className={`transition-all duration-200 py-2 px-5 rounded-full ${
            isStudent ? "bg-richblack-900" : "bg-transparent text-custom-text"
          }`}
          onClick={() => setIsStudent(true)}
        >
          Student
        </button>
        <button
          type="button"
          className={`transition-all duration-200 py-2 px-5 rounded-full ${
            isStudent ? "bg-transparent text-custom-text" : "bg-richblack-900"
          }`}
          onClick={() => setIsStudent(false)}
        >
          Instructor
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-y-4 mt-6 p-1"
      >
        {/* First + Last Name */}
        <div className="flex gap-x-4">
          <label className="w-full">
            <p className="text-[1rem] mb-1 leading-[1.375rem]">
              First Name <sup className="text-red-500">*</sup>
            </p>
            <input
              type="text"
              placeholder="Enter your first name"
              className="bg-richblack-800 w-full rounded-[0.5rem] p-[12px] border-b-1 border-b-white"
              {...register("firstName", {
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
              })}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </label>

          <label className="w-full">
            <p className="text-[1rem] mb-1 leading-[1.375rem]">
              Last Name <sup className="text-red-500">*</sup>
            </p>
            <input
              type="text"
              placeholder="Enter your last name"
              className="bg-richblack-800 w-full rounded-[0.5rem] p-[12px] border-b-1 border-b-white"
              {...register("lastName", {
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
              })}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </label>
        </div>

        {/* Email */}
        <label className="w-full">
          <p className="text-[1rem] mb-1 leading-[1.375rem]">
            Email Address<sup className="text-red-500">*</sup>
          </p>
          <input
            type="email"
            placeholder="Enter email address"
            className="bg-richblack-800 w-full rounded-[0.5rem] p-[12px] border-b-1 border-b-white"
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
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </label>

        {/* Password + Confirm */}
        <div className="flex gap-x-4">
          {/* Password field */}
          <label className="w-full">
            <p className="text-[1rem] mb-1 leading-[1.375rem]">
              Password <sup className="text-red-500">*</sup>
            </p>

            {/* IMPORTANT: relative wrapper with reserved min-height so icon won't move */}
            <div className="relative min-h-[44px]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="bg-richblack-800 w-full rounded-[0.5rem] p-[12px] border-b-1 border-b-white pr-12"
                {...register("password", {
                  required: "Password is required",
                  validate: {
                    length: (v) =>
                      (v && v.length >= 8 && v.length <= 20) ||
                      "Password must be 8-20 characters long",
                    uppercase: (v) =>
                      /[A-Z]/.test(v) ||
                      "Password must contain at least one uppercase letter",
                    lowercase: (v) =>
                      /[a-z]/.test(v) ||
                      "Password must contain at least one lowercase letter",
                    number: (v) =>
                      /\d/.test(v) || "Password must contain at least one number",
                    special: (v) =>
                      /[^A-Za-z0-9]/.test(v) ||
                      "Password must contain one special character",
                    noSpaces: (v) =>
                      !/\s/.test(v) || "Password cannot contain spaces",
                  },
                  onChange: (e) => updateStrength(e.target.value),
                })}
              />

              {/* Icon is absolutely centered relative to this wrapper and won't move */}
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            {/* Error rendered outside the relative wrapper so it does not affect icon centering */}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </label>

          {/* Confirm Password */}
          <label className="w-full">
            <p className="text-[1rem] mb-1 leading-[1.375rem]">
              Confirm Password<sup className="text-red-500">*</sup>
            </p>

            <div className="relative min-h-[44px]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="bg-richblack-800 w-full rounded-[0.5rem] p-[12px] border-b-1 border-b-white pr-12"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (v) =>
                    v === watch("password") || "Passwords must match",
                })}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </label>
        </div>

        {/* PASSWORD STRENGTH BAR (OPTION B) */}
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

          {passwordValue && (
            <p className="text-sm mt-1 text-custom-text-2">
              {strength <= 2
                ? "Weak Password"
                : strength === 3
                ? "Medium Strength Password"
                : "Strong Password"}
            </p>
          )}
        </div>

        <button className="w-full bg-amber-300 py-[8px] rounded-[8px] text-black text-md mt-6 cursor-pointer">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
