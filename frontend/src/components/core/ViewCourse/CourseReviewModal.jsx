import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import Spinner from "../../common/Spinner";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";
import { ratingReview } from "../../../services/apis";
import { profile } from "../../../services/apis";
import IconBtn from "../../common/IconBtn";

export default function CourseReviewModal({ setReviewModal }) {
  const [user, setUser] = useState(null);
  const { courseEntireData } = useSelector((state) => state.viewCourse);
  const [loading, setLoading] = useState(false);
  const [ratingLocal, setRatingLocal] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  // fetch user details
  useEffect(() => {
    let mounted = true;
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const res = await apiConnector("GET", profile.GET_USER_DETAILS);
        // res.data shape based on the payload you provided
        if (res?.data?.success && mounted) {
          setUser(res.data.userDetails);
        } else if (!res?.data?.success) {
          toast.error(res?.data?.message || "Failed to fetch user details");
        }
      } catch (err) {
        console.error("fetchUserDetails error:", err);
        toast.error("Failed to fetch user details");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUserDetails();

    return () => {
      mounted = false;
    };
  }, []);

  // initialize form defaults once
  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
    setRatingLocal(0);
  }, []);

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating);
    setRatingLocal(newRating);
  };

  const onSubmit = async (data) => {
    const rating = Number(data.courseRating);
    const review = (data.courseExperience || "").trim();

    if (!review) {
      toast.error("Please add your experience");
      return;
    }
    if (isNaN(rating) || rating <= 0) {
      toast.error("Please give a rating (1-5)");
      return;
    }

    if (!courseEntireData?._id) {
      toast.error("Course data is missing");
      return;
    }
    if (!user?._id) {
      toast.error("User data is missing");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        courseId: courseEntireData._id,
        userId: user._id,
        rating: rating,
        review: review,
      };
      console.log("PAYLOAD SENT ===>", payload);
      const res = await apiConnector("POST", ratingReview.CREATE_RR, payload);

      if (res?.data?.success) {
        toast.success(res.data.message || "Review added successfully");
        setReviewModal(false);
      } else {
        toast.error(res?.data?.message || "Failed to add review");
      }
    } catch (err) {
      console.error("submit review error:", err);
      toast.error("User has already given review");
    } finally {
      setLoading(false);
    }
  };

  // const onSubmit = async (data) => {
  //   console.log(data)
  // }

  if (loading) return <Spinner />;

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-richblack-900 bg-opacity-50 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-700 bg-richblack-800 shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5 border-b border-richblack-700">
          <p className="text-xl font-semibold text-richblack-5">Add Review</p>
          <button
            onClick={() => setReviewModal(false)}
            aria-label="Close review modal"
            className="rounded-md p-1 hover:bg-richblack-600 transition"
          >
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center gap-x-4">
            <img
              src={user?.image}
              alt={user ? `${user.firstName} profile` : "profile"}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-300">Posting Publicly</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col">
            <div className="flex justify-center">
              <div className="flex items-center gap-3">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const i = idx + 1
                  const filled = hoverRating ? i <= hoverRating : i <= ratingLocal
                  return (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      onFocus={() => setHoverRating(i)}
                      onBlur={() => setHoverRating(0)}
                      onClick={() => ratingChanged(i)}
                      aria-label={`Set rating ${i}`}
                      className={`transform transition-all duration-150 ease-out focus:outline-none ${filled ? "text-yellow-50 scale-110" : "text-richblack-400 hover:text-yellow-50 hover:scale-110"}`}
                    >
                      <span className="text-5xl leading-none">★</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 flex w-full flex-col space-y-2">
              <label className="text-sm text-richblack-5" htmlFor="courseExperience">
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Add Your Experience"
                {...register("courseExperience", { required: true })}
                className="bg-richblack-800 text-richblack-5 placeholder-richblack-400 rounded-md p-3 border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none min-h-[130px] w-full transition"
              />
              {errors.courseExperience && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Please Add Your Experience
                </span>
              )}
            </div>

            <div className="mt-6 flex w-full justify-end gap-x-2">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-700 py-2 px-4 font-semibold text-richblack-5 hover:bg-richblack-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              >
                Cancel
              </button>

              {/* Submit button */}
              <IconBtn text={loading ? "Saving..." : "Save"} type={"submit"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
