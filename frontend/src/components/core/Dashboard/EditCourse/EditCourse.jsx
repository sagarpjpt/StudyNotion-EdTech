import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { apiConnector } from "../../../../services/apiConnector";
import { courses } from "../../../../services/apis";
import { setCourse, setEditCourse } from "../../../../redux/slices/courseSlice";
import RenderSteps from "../AddCourse/RenderSteps";
import Spinner from "../../../common/Spinner";
import { toast } from "react-hot-toast";

export default function EditCourse() {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  // fetch the course details by id provided in params
  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);

      try {
        const response = await apiConnector(
          "GET",
          courses.GET_COURSE_DETAILS + courseId
        );

        if (response?.data?.success) {
          dispatch(setEditCourse(true));
          dispatch(setCourse(response.data.course));
        } else {
          toast.error(
            response?.data?.message || "Failed to fetch course details"
          );
        }
      } catch (error) {
        console.error("GET_COURSE_DETAILS ERROR →", error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong while fetching course details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  );
}
