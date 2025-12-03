import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { apiConnector } from "../../../../../services/apiConnector";
import { course_sections } from "../../../../../services/apis";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../redux/slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import NestedView from "./NestedView";
import Spinner from "../../../../common/Spinner";

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null); // stores sectionId being edited
  const dispatch = useDispatch();

  // -------------------------
  //  SUBMIT HANDLER
  // -------------------------
  // inside CourseBuilderForm component
  const onSubmit = async (data) => {
    setLoading(true);
    let apiResult = null;

    try {
      if (editSectionName) {
        // EDIT SECTION
        const res = await apiConnector("PUT", course_sections.EDIT_SECTION, {
          sectionId: editSectionName,
          sectionName: data.sectionName,
        });

        if (res?.data?.success) {
          toast.success(res.data.message || "Section updated successfully");
          // If controller returns courseDetails (like createSection), use that, otherwise patch locally:
          if (res.data.courseDetails) {
            dispatch(setCourse(res.data.courseDetails));
          } else {
            // If controller returns updatedSection, update locally
            // For edit section we expect updated section alone? adjust as needed
            // For safety, we refetch or update locally — here we will optimistic update: set section name locally
            const updatedCourseContent = (course.courseContent || []).map((s) =>
              String(s._id) === String(editSectionName)
                ? { ...s, sectionName: data.sectionName }
                : s
            );
            dispatch(
              setCourse({ ...course, courseContent: updatedCourseContent })
            );
          }
          setEditSectionName(null);
          setValue("sectionName", "");
        } else {
          toast.error(res?.data?.message || "Failed to update section");
        }
      } else {
        // CREATE SECTION
        const res = await apiConnector("POST", course_sections.CREATE_SECTION, {
          sectionName: data.sectionName,
          courseId: course._id,
        });

        if (res?.data?.success) {
          toast.success(res.data.message || "Section created successfully");
          // controller returns courseDetails
          if (res.data.courseDetails) {
            dispatch(setCourse(res.data.courseDetails));
          }
          setValue("sectionName", "");
        } else {
          toast.error(res?.data?.message || "Failed to create section");
        }
      }
    } catch (err) {
      console.error("SECTION API ERROR →", err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing a section
  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  // When clicking edit icon in UI
  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  // -------------------------
  // Navigation Logic
  // -------------------------
  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add at least one section");
      return;
    }

    if (course.courseContent.some((sec) => sec.subSection.length === 0)) {
      toast.error("Please add at least one lecture in each section");
      return;
    }

    dispatch(setStep(3));
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  if (loading) return <Spinner />;

  return (
    <div className="mb-8 space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      {/* ---------------- FORM ---------------- */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>

          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="bg-richblack-700 w-full rounded-md p-3 border border-richblack-700 
            placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-blue-200 
            transition text-richblack-5"
          />

          {errors.sectionName && (
            <span className="ml-2 text-xs text-pink-200">
              Section name is required
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Update Section" : "Add Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>

          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* SECTIONS LIST */}
      {course.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      {/* NEXT / BACK BUTTONS */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="rounded-md bg-richblack-300 py-[8px] px-[20px] 
          text-richblack-900 font-semibold"
        >
          Back
        </button>

        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  );
}
