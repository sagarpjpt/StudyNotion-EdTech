import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { apiConnector } from "../../../../services/apiConnector";
import { courses } from "../../../../services/apis";
import {
  resetCourseState,
  setCourse,
  setStep,
} from "../../../../redux/slices/courseSlice";
import { COURSE_STATUS } from "../../../../utils/constants";
import IconBtn from "../../../common/IconBtn";

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  // Auto-check checkbox if already published
  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, []);

  const goBack = () => dispatch(setStep(2));

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  // ---------------------------
  //      PUBLISH COURSE
  // ---------------------------
  const handleCoursePublish = async () => {
    const isPublicChecked = getValues("public");

    // -----------------------------
    // NO CHANGE → NO API CALL NEEDED
    // -----------------------------
    if (
      (course?.status === COURSE_STATUS.PUBLISHED && isPublicChecked === true) ||
      (course?.status === COURSE_STATUS.DRAFT && isPublicChecked === false)
    ) {
      toast("No changes made");
      goToCourses();
      return;
    }

    // new status
    const newStatus = isPublicChecked
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;

    const formData = new FormData();
    formData.append("courseId", course._id);
    formData.append("status", newStatus);

    setLoading(true);

    try {
      const res = await apiConnector(
        "PUT",
        courses.EDIT_COURSE,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (!res?.data?.success) {
        toast.error(res?.data?.message || "Failed to update course status");
        setLoading(false);
        return;
      }

      toast.success("Course status updated");

      // update redux with the updated course
      dispatch(setCourse(res.data.course));

      goToCourses();
    } catch (err) {
      console.error("PUBLISH ERROR →", err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  const onSubmit = () => handleCoursePublish();

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Publish Settings</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg gap-2">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="h-4 w-4 rounded-md bg-richblack-800 border border-richblack-700 
              text-yellow-50 accent-yellow-50 checked:bg-yellow-50 checked:border-yellow-50
              focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
            />
            <span className="ml-2 text-richblack-5">
              Make this course public
            </span>
          </label>
        </div>

        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 
            py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>

          <IconBtn
            disabled={loading}
            text={loading ? "Saving..." : "Save Changes"}
          />
        </div>
      </form>
    </div>
  );
}
