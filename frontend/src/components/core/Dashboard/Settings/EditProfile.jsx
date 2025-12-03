import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { apiConnector } from "../../../../services/apiConnector";
import { profile } from "../../../../services/apis";
import IconBtn from "../../../common/IconBtn";
import { useState } from "react";
import Spinner from "../../../common/Spinner";
import toast from "react-hot-toast";
import { useEffect } from "react";

const genders = ["Male", "Female", "Prefer not to say", "Other"];

export default function EditProfile({ user, setUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitProfileForm = async (data) => {
    setLoading(true);
    try {
      // Make API call
      const res = await apiConnector("PUT", profile.UPDATE_PROFILE, data);

      if (res?.data?.success) {
        toast.success("Profile Updated Successfully!");
        // Redirect back to profile page
        navigate("/dashboard/my-profile");
      } else {
        toast.error(res?.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)} className="w-full">
        {/* PROFILE INFO CARD */}
        <div className="my-10 flex flex-col gap-y-8 rounded-lg border border-richblack-700 bg-richblack-800 p-10 shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-richblack-600">
          {/* Section Heading */}
          <h2 className="text-2xl font-semibold text-richblack-5 border-b border-richblack-700 pb-3">
            Profile Information
          </h2>

          {/* -------- NAME ROW -------- */}
          <div className="flex flex-col lg:flex-row gap-7">
            {/* FIRST NAME */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="firstName" className="text-sm text-richblack-200">
                First Name <span className="text-yellow-50">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter first name"
                className="bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-md p-3 border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                {...register("firstName", { required: true })}
                defaultValue={user?.firstName}
              />
              {errors.firstName && (
                <span className="text-xs text-yellow-100">
                  Please enter your first name.
                </span>
              )}
            </div>

            {/* LAST NAME */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="lastName" className="text-sm text-richblack-200">
                Last Name <span className="text-yellow-50">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter last name"
                className="bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-md p-3 border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                {...register("lastName", { required: true })}
                defaultValue={user?.lastName}
              />
              {errors.lastName && (
                <span className="text-xs text-yellow-100">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>

          {/* -------- DOB + GENDER -------- */}
          <div className="flex flex-col lg:flex-row gap-7">
            {/* DOB */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label
                htmlFor="dateOfBirth"
                className="text-sm text-richblack-200"
              >
                Date of Birth <span className="text-yellow-50">*</span>
              </label>
              <input
                type="date"
                id="dateOfBirth"
                className="bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-md p-3 border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                {...register("dateOfBirth", {
                  required: true,
                  max: new Date().toISOString().split("T")[0],
                })}
                defaultValue={user?.additionalDetails?.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <span className="text-xs text-yellow-100">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>

            {/* GENDER */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="gender" className="text-sm text-richblack-200">
                Gender <span className="text-yellow-50">*</span>
              </label>
              <select
                id="gender"
                className="bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-md p-3 border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                {...register("gender", { required: true })}
                defaultValue={user?.additionalDetails?.gender}
              >
                {genders.map((ele, i) => (
                  <option key={i} value={ele}>
                    {ele}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* -------- CONTACT + ABOUT -------- */}
          <div className="flex flex-col lg:flex-row gap-7">
            {/* CONTACT */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label
                htmlFor="contactNumber"
                className="text-sm text-richblack-200"
              >
                Contact Number <span className="text-yellow-50">*</span>
              </label>
              <input
                type="tel"
                id="contactNumber"
                placeholder="Enter contact number"
                className="bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-md p-3 border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                {...register("contactNumber", {
                  required: true,
                  maxLength: 12,
                  minLength: 10,
                })}
                defaultValue={user?.additionalDetails?.contactNumber}
              />
              {errors.contactNumber && (
                <span className="text-xs text-yellow-100">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>

            {/* ABOUT */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="about" className="text-sm text-richblack-200">
                About <span className="text-yellow-50">*</span>
              </label>
              <input
                type="text"
                id="about"
                placeholder="Enter bio details"
                className="bg-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-md p-3 border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                {...register("about", { required: true })}
                defaultValue={user?.additionalDetails?.about}
              />
              {errors.about && (
                <span className="text-xs text-yellow-100">
                  Please enter bio.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-profile")}
            className="rounded-md bg-richblack-700 px-5 py-2 text-richblack-100 font-semibold hover:bg-richblack-600 transition-all"
          >
            Cancel
          </button>

          <IconBtn
            type="submit"
            text="Save"
            customClasses="bg-yellow-50 hover:scale-95 hover:shadow-none"
          />
        </div>
      </form>
    </>
  );
}
