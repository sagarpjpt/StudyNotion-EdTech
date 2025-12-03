import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import { BsList } from "react-icons/bs";
import { apiConnector } from "../services/apiConnector";
import { courses } from "../services/apis";

import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../redux/slices/viewCourseSlice";

export default function ViewCourse() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [reviewModal, setReviewModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const response = await apiConnector(
          "GET",
          courses.GET_COURSE_DETAILS + courseId
        );

        const response2 = await apiConnector(
          "GET",
          courses.GET_COURSE_PROGRESS + courseId
        );

        if (!response?.data?.success) {
          toast.error(response?.data?.message || "Failed to fetch course");
          return;
        }

        const course = response.data.course;

        // Safety check
        if (!course) {
          toast.error("Course not found");
          return;
        }

        // 1) Set complete course data
        dispatch(setEntireCourseData(course));

        // 2) Set section + subsections
        dispatch(setCourseSectionData(course.courseContent || []));

        // 3) Completed lectures (fallback [])
        dispatch(setCompletedLectures(response2?.data?.completedVideos || []));

        // 4) Calculate total lectures
        let totalLectures = 0;
        course.courseContent?.forEach((section) => {
          totalLectures += section.subSection?.length || 0;
        });

        dispatch(setTotalNoOfLectures(totalLectures));
      } catch (err) {
        console.error("COURSE FETCH ERROR:", err);
        toast.error(err?.response?.data?.message || "Something went wrong");
      }
    })();
  }, [courseId, dispatch]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-richblack-800 border-b border-richblack-700">
        <button onClick={() => navigate("/dashboard/enrolled-courses")}>
          <IoIosArrowBack size={24} className="text-richblack-200" />
        </button>

        <button
          className="text-yellow-50 bg-richblack-700 px-3 py-1 rounded-md"
          onClick={() => setReviewModal(true)}
        >
          Add Review
        </button>

        {/* Button to open mobile sidebar */}
        <button onClick={() => setShowMobileSidebar(true)}>
          <BsList size={24} className="text-richblack-200" />
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {showMobileSidebar && (
        <div className="fixed inset-0 bg-black/60 z-50">
          <div className="absolute left-0 top-0 w-[80%] h-full bg-richblack-800 p-4 overflow-y-auto">
            <VideoDetailsSidebar setReviewModal={setReviewModal} />
          </div>
          <div
            className="absolute inset-0"
            onClick={() => setShowMobileSidebar(false)}
          />
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
        </div>
        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 md:p-7">
          <Outlet />
        </div>
      </div>

      

      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
}
