import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { apiConnector } from "../../../../services/apiConnector";
import { auth } from "../../../../services/apis";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import IconBtn from "../../../common/IconBtn";
import Spinner from "../../../common/Spinner";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const submitPasswordForm = async (data) => {
    setLoading(true);
    try {
      const res = await apiConnector("PUT", auth.CHANGE_PASSWORD, data);
      if (res?.data?.success) {
        toast.success("Password Change Successfully");
      } else {
        toast.error(res?.data?.message || "Cant Change the Password");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        {/* CARD */}
        <div className="my-10 flex flex-col gap-y-8 rounded-lg border border-richblack-700 bg-richblack-800 p-10 shadow-[0_0_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:border-richblack-600">
          <h2 className="text-2xl font-semibold text-richblack-5 border-b border-richblack-700 pb-3">
            Update Password
          </h2>

          {/* ROW 1 — OLD + NEW PASSWORD */}
          <div className="flex flex-col lg:flex-row gap-7">
            {/* OLD PASSWORD */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label
                htmlFor="oldPassword"
                className="text-sm text-richblack-200"
              >
                Current Password <span className="text-yellow-50">*</span>
              </label>

              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                placeholder="Enter current password"
                className="bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-md p-3 border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                {...register("oldPassword", { required: true })}
              />

              {/* EYE ICON */}
              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translatey-y-[50%] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={22} fill="#AFB2BF" />
                )}
              </span>

              {errors.oldPassword && (
                <span className="text-xs text-pink-300">
                  Please enter your current password.
                </span>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label
                htmlFor="newPassword"
                className="text-sm text-richblack-200"
              >
                New Password <span className="text-yellow-50">*</span>
              </label>

              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                placeholder="Enter new password"
                className="bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-md p-3 border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                {...register("newPassword", { required: true })}
              />

              {/* EYE ICON */}
              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translatey-y-[50%] cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={22} fill="#AFB2BF" />
                )}
              </span>

              {errors.newPassword && (
                <span className="text-xs text-pink-300">
                  Please enter your new password.
                </span>
              )}
            </div>
          </div>

          {/* ROW 2 — CONFIRM PASSWORD */}
          <div className="flex flex-col lg:flex-row">
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label
                htmlFor="confirmNewPassword"
                className="text-sm text-richblack-200"
              >
                Confirm New Password <span className="text-yellow-50">*</span>
              </label>

              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmNewPassword"
                placeholder="Confirm new password"
                className="bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-md p-3 border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                {...register("confirmNewPassword", { required: true })}
              />

              {/* EYE ICON */}
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translatey-y-[50%] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={22} fill="#AFB2BF" />
                )}
              </span>

              {errors.confirmNewPassword && (
                <span className="text-xs text-pink-300">
                  Please confirm your new password.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-profile")}
            className="rounded-md bg-richblack-700 px-5 py-2 text-richblack-100 font-semibold hover:bg-richblack-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          >
            Cancel
          </button>

          <IconBtn
            type="submit"
            text="Update"
            customClasses="bg-yellow-50 hover:scale-95 hover:shadow-none"
          />
        </div>
      </form>
    </>
  );
}
