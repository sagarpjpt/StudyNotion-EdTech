
import React, { useEffect, useState } from "react";
import RatingStars from "../../common/RatingStars";
import { apiConnector } from "../../../services/apiConnector";
import { ratingReview } from "../../../services/apis";
import { Link } from "react-router-dom";

const Course_Card = ({ course, Height = "max-h-[360px]" }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    if (!course?._id) return;
    let cancelled = false;

    const getAvgRating = async () => {
      try {
        const res = await apiConnector("GET", `${ratingReview.GET_AVG_RR}${course._id}`);
        if (!cancelled && res?.data?.success) {
          setAvgReviewCount(res.data.averageRating || 0);
        }
      } catch (err) {
        console.error("getAvgRating error:", err);
      }
    };

    getAvgRating();
    return () => {
      cancelled = true;
    };
  }, [course?._id]);

  return (
    <Link to={`/courses/${course?._id}`} className="block w-full h-full">
      <div
        className={`rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 transform group hover:-translate-y-1 ${Height} bg-white/5 backdrop-blur-sm border border-richblack-700 overflow-hidden flex flex-col max-w-[350px]`}
      >
        <div className="rounded-t-2xl overflow-hidden aspect-video relative">
          <img
            src={course?.thumbnail}
            alt={course?.courseName || "course thumbnail"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-2 px-4 py-4 flex-1">
          <p className="text-lg font-semibold text-richblack-5 truncate" title={course?.courseName}>
            {course?.courseName}
          </p>

          <p className="text-sm text-richblack-50 font-medium truncate">
            {course?.instructor ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}` : "Instructor"}
          </p>

          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-yellow-5 font-bold text-base">
                {avgReviewCount ? avgReviewCount.toFixed(1) : "0.0"}
              </span>
              <RatingStars Review_Count={avgReviewCount} Star_Size={16} />
            </div>

            <div className="text-right">
              <span className="text-xs text-richblack-400 font-medium block">
                {Array.isArray(course?.ratingAndReviews) ? course.ratingAndReviews.length : 0} Ratings
              </span>
            </div>
          </div>

          <div className="flex-1" />

          <p className="text-xl font-bold text-yellow-25 mt-2">Rs. {course?.price ?? "Free"}</p>
        </div>
      </div>
    </Link>
  );
};

export default Course_Card;
