import React, { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { ratingReview } from "../../services/apis";
import Spinner from "../common/Spinner";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ReviewSlider = () => {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", ratingReview.GET_ALL_RR);
        if (res?.data?.success) {
          setReviews(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <Spinner />;
  if (!loading && reviews.length === 0)
    return <p className="text-richblack-200">No reviews available.</p>;

  return (
    <div className="my-10 lg:w-11/12 w-full px-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
        }}
        spaceBetween={30}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="px-5"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review._id}>
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  return (
    <div className="border border-richblack-600 bg-richblack-700 p-5 rounded-xl shadow-md text-richblack-5 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-blue-200 text-richblack-900 flex items-center justify-center font-bold text-lg">
          {review?.user?.firstName?.charAt(0)?.toUpperCase()}
        </div>

        <div>
          <p className="font-semibold text-richblack-5">
            {review?.user?.firstName} {review?.user?.lastName}
          </p>
          <p className="text-sm text-richblack-200">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Rating */}
      <p className="text-yellow-50 text-lg">
        {"★".repeat(Math.round(review.rating))}
        {"☆".repeat(5 - Math.round(review.rating))}
      </p>

      {/* Review Text */}
      <p className="mt-3 text-richblack-25 text-sm">{review.review}</p>
    </div>
  );
};

export default ReviewSlider;
