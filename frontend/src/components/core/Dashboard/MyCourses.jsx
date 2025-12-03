import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { apiConnector } from "../../../services/apiConnector"
import { courses as courses_api } from "../../../services/apis";

import IconBtn from "../../common/IconBtn"
import CoursesTable from "./InstructorCourses/CoursesTable"
import Spinner from "../../common/Spinner"
import MobileCourseCards from "./InstructorCourses/MobileCourseCards"
import { setCourse } from "../../../redux/slices/courseSlice"

export default function MyCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
  const fetchCourses = async () => {
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

  fetchCourses();
}, []);

    if(loading) return <Spinner />

  return (
    <div>
      <div className="mb-8 lg:mb-14 flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
          customClasses={'!px-3 !py-2 text-sm'}
        >
          <VscAdd />
        </IconBtn>
      </div>
      <div className="hidden md:block">
        {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
      </div>
      <div className="block md:hidden">
        {courses && <MobileCourseCards courses={courses} setCourses={setCourses} />}
      </div>
    </div>
  )
}