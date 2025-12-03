import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { apiConnector } from "../../../services/apiConnector";
import { courses } from "../../../services/apis";
import { getTotalCourseDuration } from "../../../utils/getTotalCourseDuration";
import Spinner from "../../common/Spinner";
import IconBtn from "../../common/IconBtn";

export default function EnrolledCourses() {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Enrolled Courses
  const getEnrolledCourses = async () => {
    try {
      const res = await apiConnector(
        "GET",
        courses.GET_STUDENT_ENROLLED_COURSES
      );

      if (res?.data?.success) {
        setEnrolledCourses(res.data.courses);
      } else {
        toast.error(res?.data?.message || "Failed to fetch enrolled courses");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while loading courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  // Loading UI
  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {/* {desktop view} */}
      <div className="hidden md:block">
        <div className="text-3xl text-richblack-50">Enrolled Courses</div>

        {enrolledCourses.length === 0 ? (
          <p className="grid h-[10vh] w-full place-content-center text-richblack-300 text-lg mt-8">
            You haven't enrolled in any course yet.
          </p>
        ) : (
          <div className="my-8 text-richblack-5">
            {/* Heading Row */}
            <div className="flex rounded-t-lg bg-richblack-500">
              <p className="w-[45%] px-5 py-3">Course Name</p>
              <p className="w-1/4 px-2 py-3">Duration</p>
              <p className="flex-1 px-2 py-3">Progress</p>
            </div>

            {enrolledCourses.map((course, i, arr) => {
              const firstSection = course.courseContent?.[i];
              const firstLecture = firstSection?.subSection?.[i];

              return (
                <div
                  className={`flex items-center border border-richblack-700 ${
                    i === arr.length - 1 ? "rounded-b-lg" : ""
                  }`}
                  key={course._id}
                >
                  {/* Course Title + Image */}
                  <div
                    className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                    onClick={() => {
                      if (firstSection && firstLecture) {
                        navigate(
                          `/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstLecture._id}`
                        );
                      } else {
                        toast.error("This course has no content yet.");
                      }
                    }}
                  >
                    <img
                      src={course.thumbnail}
                      alt="course thumbnail"
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="flex max-w-xs flex-col gap-2">
                      <p className="font-semibold">{course.courseName}</p>
                      <p className="text-xs text-richblack-300">
                        {course.courseDescription.length > 50
                          ? `${course.courseDescription.slice(0, 50)}...`
                          : course.courseDescription}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="w-1/4 px-2 py-3">
                    {getTotalCourseDuration(course)}
                  </div>

                  {/* Progress */}
                  <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                    <p>Progress: {course.progressPercentage}%</p>
                    <ProgressBar
                      completed={course.progressPercentage}
                      height="8px"
                      isLabelVisible={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* mobile view */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-6 md:hidden mt-6">
          {enrolledCourses.map((course) => {
            const firstSection = course.courseContent?.[0];
            const firstLecture = firstSection?.subSection?.[0];

            return (
              <div
                key={course._id}
                onClick={() => {
                  if (firstSection && firstLecture) {
                    navigate(
                      `/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstLecture._id}`
                    );
                  } else {
                    toast.error("This course has no content yet.");
                  }
                }}
                className="bg-richblack-800 border border-richblack-700 rounded-xl p-4"
              >
                {/* Thumbnail */}
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-full h-[170px] rounded-lg object-cover"
                />

                {/* Text Section */}
                <div className="mt-3 space-y-1">
                  <p className="text-richblack-5 font-semibold text-lg">
                    {course.courseName}
                  </p>

                  <p className="text-xs text-richblack-300 leading-4">
                    {course.courseDescription.length > 60
                      ? `${course.courseDescription.slice(0, 60)}…`
                      : course.courseDescription}
                  </p>

                  <p className="text-[12px] text-richblack-200 mt-2">
                    Duration: {getTotalCourseDuration(course)}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full border-t border-richblack-700 my-3" />

                {/* Progress Section */}
                <div className="space-y-2 flex flex-col gap-1">
                  <ProgressBar
                    completed={course.progressPercentage}
                    height="8px"
                    isLabelVisible={false}
                  />
                  <p className="text-xs text-richblack-300">
                    Progress: {course.progressPercentage}%
                  </p>
                </div>
                
                {/* btn to view courses */}
                <div className="mt-3">
                  <Link to={`/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstLecture._id}`}>
                    <IconBtn
                      text="Start Learning"
                      customClasses={"!py-2 !px-3 !text-sm"}
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
