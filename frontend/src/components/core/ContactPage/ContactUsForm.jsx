import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CountryCode from "../../../data/countrycode.json";
import { apiConnector } from "../../../services/apiConnector";
import { contactusEndpoint } from "../../../services/apis";
import toast from "react-hot-toast";
import Spinner from "../../common/Spinner";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    try {
      setLoading(true);
      // console.log(data)
      const res = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      );
      if (res?.data?.success) {
        toast.success("Thank You! We Will Contact You Shortly");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      // console.log("ERROR MESSAGE - ", error.message);
      toast.error("Please Fill The Form Again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <form
      className="flex flex-col gap-6 bg-richblack-900 text-richblack-5 rounded-lg w-full max-w-2xl mx-auto"
      style={{ marginTop: "30px" }}
      onSubmit={handleSubmit(submitContactForm)}
    >
      {/* ========= NAME FIELDS ========= */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* First Name */}
        <div className="flex flex-col gap-1 lg:w-1/2">
          <label
            htmlFor="firstname"
            className="text-sm font-medium text-richblack-100"
          >
            First Name <span className="text-yellow-50">*</span>
          </label>
          <input
            type="text"
            id="firstname"
            placeholder="Enter first name"
            className="px-3 py-2 rounded-md bg-richblack-800 border border-richblack-600 focus:border-yellow-50 focus:outline-none placeholder-richblack-400 text-richblack-5 transition-all duration-200"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="text-[12px] text-yellow-100">
              Please enter your name.
            </span>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1 lg:w-1/2">
          <label
            htmlFor="lastname"
            className="text-sm font-medium text-richblack-100"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter last name"
            className="px-3 py-2 rounded-md bg-richblack-800 border border-richblack-600 focus:border-yellow-50 focus:outline-none placeholder-richblack-400 text-richblack-5 transition-all duration-200"
            {...register("lastname")}
          />
        </div>
      </div>

      {/* ========= EMAIL ========= */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="text-sm font-medium text-richblack-100"
        >
          Email Address <span className="text-yellow-50">*</span>
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          className="px-3 py-2 rounded-md bg-richblack-800 border border-richblack-600 focus:border-yellow-50 focus:outline-none placeholder-richblack-400 text-richblack-5 transition-all duration-200"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-[12px] text-yellow-100">
            Please enter your Email address.
          </span>
        )}
      </div>

      {/* ========= PHONE ========= */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="phonenumber"
          className="text-sm font-medium text-richblack-100"
        >
          Phone Number <span className="text-yellow-50">*</span>
        </label>
        <div className="flex gap-3">
          {/* Country Code */}
          <select
            id="countrycode"
            className="px-2 py-2 rounded-md bg-richblack-800 border border-richblack-600 text-richblack-5 lg:w-[140px] w-[90px] focus:border-yellow-50 focus:outline-none"
            {...register("countrycode", { required: true })}
          >
            {CountryCode.map((ele, i) => (
              <option key={i} value={ele.code}>
                {ele.code} - {ele.country}
              </option>
            ))}
          </select>

          {/* Phone Number */}
          <input
            type="tel"
            id="phonenumber"
            placeholder="12345 67890"
            className="flex-1 px-3 py-2 rounded-md bg-richblack-800 border border-richblack-600 focus:border-yellow-50 focus:outline-none placeholder-richblack-400 text-richblack-5 transition-all duration-200 w-10 lg:w-auto"
            {...register("phoneNo", {
              required: {
                value: true,
                message: "Please enter your Phone Number.",
              },
              maxLength: { value: 10, message: "Invalid Phone Number" },
              minLength: { value: 10, message: "Invalid Phone Number" },
            })}
          />
        </div>
        {errors.phoneNo && (
          <span className="text-[12px] text-yellow-100">
            {errors.phoneNo.message}
          </span>
        )}
      </div>

      {/* ========= MESSAGE ========= */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="message"
          className="text-sm font-medium text-richblack-100"
        >
          Message <span className="text-yellow-50">*</span>
        </label>
        <textarea
          id="message"
          rows="5"
          placeholder="Enter your message here..."
          className="px-3 py-2 rounded-md bg-richblack-800 border border-richblack-600 focus:border-yellow-50 focus:outline-none placeholder-richblack-400 text-richblack-5 transition-all duration-200 resize-none"
          {...register("message", { required: true })}
        ></textarea>
        {errors.message && (
          <span className="text-[12px] text-yellow-100">
            Please enter your Message.
          </span>
        )}
      </div>

      {/* ========= SUBMIT BUTTON ========= */}
      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[14px] font-semibold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]
          ${
            !loading &&
            "transition-all duration-200 hover:scale-95 hover:shadow-none"
          }
          disabled:bg-richblack-500`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactUsForm;
