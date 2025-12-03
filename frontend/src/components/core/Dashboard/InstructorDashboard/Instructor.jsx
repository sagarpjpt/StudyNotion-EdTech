import React, { useEffect, useState } from "react";
import InstructorChart from "./InstructorChart";
import { Link } from "react-router-dom";
import { apiConnector } from "../../../../services/apiConnector";
import { profile } from "../../../../services/apis";
import { courses as courses_api } from "../../../../services/apis";
import Spinner from "../../../common/Spinner";

export default function Instructor() {
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch user
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await apiConnector("GET", profile.GET_USER_DETAILS);
        if (res?.data?.success) {
          setUser(res.data.userDetails);
        }
      } catch (error) {
        console.error("Error fetching profile icon:", error);
      }
    };
    fetchUserDetails();
  }, []);

  // get instructor courses
  useEffect(() => {
    const fetchInstructorCourses = async () => {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          courses_api.GET_INSTRUCTOR_COURSES
        );

        if (response?.data?.success) {
          setCourses(response.data.courses);
        }
      } catch (error) {
        console.error("Failed to fetch instructor courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructorCourses();
  }, []);

  // get instructor dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await apiConnector(
          "GET",
          profile.GET_INSTRUCTOR_DASHBOARD_DATA
        );

        if (res?.data?.success) {
          setInstructorData(res.data.data);
        } else {
          toast.error(res?.data?.message || "Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("ERROR →", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>
      {loading ? (
        <Spinner />
      ) : courses.length > 0 ? (
        // <div>
        //   <div className="my-4 flex min-h-[350px] space-x-4">
        //     {/* Render chart / graph */}
        //     {totalAmount > 0 || totalStudents > 0 ? (
        //       <InstructorChart courses={instructorData} />
        //     ) : (
        //       <div className="flex-1 rounded-md bg-richblack-800 p-6">
        //         <p className="text-lg font-bold text-richblack-5">Visualize</p>
        //         <p className="mt-4 text-xl font-medium text-richblack-50">
        //           Not Enough Data To Visualize
        //         </p>
        //       </div>
        //     )}
        //     {/* Total Statistics */}
        //     <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
        //       <p className="text-lg font-bold text-richblack-5">Statistics</p>
        //       <div className="mt-4 space-y-4">
        //         <div>
        //           <p className="text-lg text-richblack-200">Total Courses</p>
        //           <p className="text-3xl font-semibold text-richblack-50">
        //             {courses.length}
        //           </p>
        //         </div>
        //         <div>
        //           <p className="text-lg text-richblack-200">Total Students</p>
        //           <p className="text-3xl font-semibold text-richblack-50">
        //             {totalStudents}
        //           </p>
        //         </div>
        //         <div>
        //           <p className="text-lg text-richblack-200">Total Income</p>
        //           <p className="text-3xl font-semibold text-richblack-50">
        //             Rs. {totalAmount}
        //           </p>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        //   <div className="rounded-md bg-richblack-800 p-6">
        //     {/* Render 3 courses */}
        //     <div className="flex items-center justify-between">
        //       <p className="text-lg font-bold text-richblack-5">Your Courses</p>
        //       <Link to="/dashboard/my-courses">
        //         <p className="text-xs font-semibold text-yellow-50">View All</p>
        //       </Link>
        //     </div>
        //     <div className="my-4 flex items-start space-x-6">
        //       {courses.slice(0, 3).map((course) => (
        //         <div key={course._id} className="w-1/3">
        //           <img
        //             src={course.thumbnail}
        //             alt={course.courseName}
        //             className="h-[201px] w-full rounded-md object-cover"
        //           />
        //           <div className="mt-3 w-full">
        //             <p className="text-sm font-medium text-richblack-50">
        //               {course.courseName}
        //             </p>
        //             <div className="mt-1 flex items-center space-x-2">
        //               <p className="text-xs font-medium text-richblack-300">
        //                 {course.studentsEnrolled.length} students
        //               </p>
        //               <p className="text-xs font-medium text-richblack-300">
        //                 |
        //               </p>
        //               <p className="text-xs font-medium text-richblack-300">
        //                 Rs. {course.price}
        //               </p>
        //             </div>
        //           </div>
        //         </div>
        //       ))}
        //     </div>
        //   </div>
        // </div>
        <div className="">
          {/* ---------- TOP SECTION: CHART + STATS ---------- */}
          <div className="my-6 flex flex-col lg:flex-row min-h-[350px] gap-6">
            {/* Chart Box */}
            <div className="flex-1 rounded-md bg-richblack-800 p-6">
              {totalAmount > 0 || totalStudents > 0 ? (
                <InstructorChart courses={instructorData} />
              ) : (
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <p className="text-lg font-bold text-richblack-5">
                      Visualize
                    </p>
                    <p className="mt-3 text-xl font-medium text-richblack-50">
                      Not Enough Data To Visualize
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Statistics Box */}
            <div className="w-full lg:w-[280px] rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>

              <div className="mt-4 space-y-5">
                <div>
                  <p className="text-base text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {courses.length}
                  </p>
                </div>

                <div>
                  <p className="text-base text-richblack-200">Total Students</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>

                <div>
                  <p className="text-base text-richblack-200">Total Income</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    Rs. {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- BOTTOM SECTION: COURSES ---------- */}
          <div className="rounded-md bg-richblack-800 p-6 mt-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </Link>
            </div>

            {/* Courses Grid */}
            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="rounded-md">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[200px] w-full rounded-md object-cover"
                  />

                  <div className="mt-3">
                    <p className="text-sm font-medium text-richblack-50">
                      {course.courseName}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {course.studentsEnrolled.length} students
                      </p>

                      <span className="text-xs text-richblack-300">|</span>

                      <p className="text-xs font-medium text-richblack-300">
                        Rs. {course.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
