import React from "react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../../utils/formatDate";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../../services/apiConnector";
import { courses as courses_api } from "../../../../services/apis";
import { getTotalCourseDuration } from "../../../../utils/getTotalCourseDuration";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import Spinner from "../../../common/Spinner";

const MobileCourseCards = ({ courses, setCourses }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const TRUNCATE_LENGTH = 30;

  const handleCourseDelete = async (courseId) => {
    setLoading(true);

    try {
      // 1) Delete request
      const delRes = await apiConnector("DELETE", courses_api.DELETE_COURSE, {
        courseId,
      });

      if (!delRes?.data?.success) {
        // backend returned failure
        // show error (you may be using react-toastify or your own toast)
        toast.error(delRes?.data?.message || "Failed to delete course");
        return;
      }

      // 2) Try to re-fetch instructor courses
      const res = await apiConnector("GET", courses_api.GET_INSTRUCTOR_COURSES);

      if (res?.data?.success) {
        // handle both possible payload shapes
        const newCourses = res.data?.courses ?? [];
        setCourses(newCourses);
        toast.success(delRes?.data?.message || "Course deleted successfully");
      } else {
        // Deletion succeeded but refresh failed — fallback to removing locally
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
        toast.warn("Course deleted but failed to refresh list");
      }
    } catch (error) {
      console.error("handleCourseDelete error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setConfirmationModal(null);
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div className="flex flex-col gap-6 md:hidden mb-8">
        {courses.map((course) => (
          <div
            key={course._id}
            className="rounded-xl bg-richblack-800 border border-richblack-700 p-4"
          >
            {/* Thumbnail */}
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="w-full h-[180px] rounded-lg object-cover"
            />

            {/* Text Info */}
            <div className="mt-4 space-y-2">
              {/* Course Title */}
              <p className="text-lg font-semibold text-richblack-5">
                {course.courseName}
              </p>

              {/* Short Description */}
              <p className="text-xs text-richblack-300 leading-4">
                {course.courseDescription.split(" ").length > TRUNCATE_LENGTH
                  ? course.courseDescription
                      .split(" ")
                      .slice(0, TRUNCATE_LENGTH)
                      .join(" ") + "..."
                  : course.courseDescription}
              </p>

              {/* Created Date */}
              <p className="text-[12px] text-richblack-200">
                Created: {formatDate(course.createdAt)}
              </p>

              {/* Status Badge */}
              {course.status === COURSE_STATUS.DRAFT ? (
                <span className="inline-flex items-center gap-2 bg-richblack-700 text-pink-100 px-2 py-[2px] rounded-full text-[12px]">
                  <HiClock size={14} />
                  Drafted
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 bg-richblack-700 text-yellow-100 px-2 py-[2px] rounded-full text-[12px]">
                  <span className="flex items-center justify-center h-3 w-3 rounded-full bg-yellow-100 text-richblack-700">
                    <FaCheck size={8} />
                  </span>
                  Published
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="w-full border-t border-richblack-700 my-4" />

            {/* Bottom Row: Duration & Price + Actions */}
            <div className="flex items-start justify-between">
              {/* Left Section */}
              <div className="flex gap-x-6 items-center justify-center">
                <div>
                    <p className="text-xs text-richblack-300">Duration:</p>
                    <p className="text-sm font-medium text-richblack-50">{getTotalCourseDuration(course)}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-richblack-300">Price:</p>
                    <p className="text-sm font-medium text-richblack-50">
                    ₹{course.price}
                    </p>
                </div>
              </div>

              {/* Right Section: Edit / Delete */}
              <div className="flex items-center gap-5 mt-2 text-richblack-100">
                {/* Edit */}
                <button
                  onClick={() =>
                    navigate(`/dashboard/edit-course/${course._id}`)
                  }
                  title="Edit"
                  disabled={loading}
                  className="transition-all hover:scale-110 hover:text-caribbeangreen-300"
                >
                  <FiEdit2 size={22} />
                </button>

                {/* Delete */}
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Do you want to delete this course?",
                      text2:
                        "All the data related to this course will be deleted",
                      btn1Text: !loading ? "Delete" : "Loading...",
                      btn2Text: "Cancel",
                      btn1Handler: !loading
                        ? () => handleCourseDelete(course._id)
                        : () => {},
                      btn2Handler: !loading
                        ? () => setConfirmationModal(null)
                        : () => {},
                    })
                  }
                  title="Delete"
                  className="transition-all hover:scale-110 hover:text-[#ff0000]"
                >
                  <RiDeleteBin6Line size={22} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default MobileCourseCards;
