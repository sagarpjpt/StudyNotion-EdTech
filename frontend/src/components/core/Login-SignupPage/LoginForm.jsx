import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/slices/profileSlice";
import { apiConnector } from "../../../services/apiConnector";
import { auth } from "../../../services/apis";

// react-hook-form
import { useForm } from "react-hook-form";

function LoginForm({ setLoading }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    try {
      setLoading(true);

      const res = await apiConnector("POST", auth.LOGIN_API, {
        email: data.email,
        password: data.password,
      });

      if (res?.data?.success) {
        // console.log("Login response:", res);
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Logged In");
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        toast.error(res?.data?.message || "Login failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-y-4 mt-6 p-1"
      >
        {/* EMAIL FIELD */}
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
                message: "Enter a valid email address",
              },
            })}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </label>

        {/* PASSWORD FIELD */}
        <label className="w-full">
          <p className="text-[1rem] mb-1 leading-[1.375rem]">
            Password<sup className="text-red-500">*</sup>
          </p>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="enter password"
              className="bg-richblack-800 w-full rounded-[0.5rem] p-[12px] border-b-1 border-b-white pr-12"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {/* show/hide icon */}
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          {/* Forget Password */}
          <Link to="/forgot-password">
            <p className="text-right text-[0.85rem] leading-[1.375rem] text-custom-text-2 mt-1 text-red-600 cursor-pointer hover:text-richblack-5 hover:underline transition-all duration-100">
              Forget Password?
            </p>
          </Link>
        </label>

        <button className="w-full bg-amber-300 py-[8px] rounded-[8px] text-black text-md mt-6 font-bold cursor-pointer">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
