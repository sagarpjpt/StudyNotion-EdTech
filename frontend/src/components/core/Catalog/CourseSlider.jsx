
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

import Course_Card from "./Course_Card";

const CourseSlider = ({ Courses = [] }) => {
  const breakpoints = {
    320: { slidesPerView: 1, slidesPerGroup: 1 },
    768: { slidesPerView: 2, slidesPerGroup: 1 },
    1024: { slidesPerView: 3, slidesPerGroup: 1 },
  };

  const maxSlidesPerView = useMemo(
    () => Math.max(...Object.values(breakpoints).map((b) => b.slidesPerView)),
    []
  );

  const enableLoop = Courses.length > maxSlidesPerView;

  return (
    <div className="relative w-full">
      {Courses.length > 0 ? (
        <div className="rounded-2xl bg-richblack-800 shadow-lg px-2 py-6 sm:px-6 sm:py-8">
          <Swiper
            spaceBetween={24}
            loop={enableLoop}
            modules={[Pagination, Autoplay, Navigation]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation
            pagination={{ clickable: true }}
            breakpoints={breakpoints}
            watchOverflow={true}
            className="course-slider-swiper"
          >
            {Courses.map((course, i) => (
              <SwiperSlide key={course?._id || i} className="!h-auto">
                <div className="px-2">
                  <Course_Card course={course} Height="max-h-[360px]" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-xl text-richblack-5 font-semibold opacity-80">
            No Course Found
          </p>
        </div>
      )}

      <style>{`
        .course-slider-swiper .swiper-button-next,
        .course-slider-swiper .swiper-button-prev {
          color: #FFD60A;
          background: rgba(30, 41, 59, 0.85);
          border-radius: 9999px;
          width: 2.5rem;
          height: 2.5rem;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.18);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .course-slider-swiper .swiper-button-next:hover,
        .course-slider-swiper .swiper-button-prev:hover {
          background: #FFD60A;
          color: #1E293B;
          transform: scale(1.08);
          box-shadow: 0 4px 16px 0 rgba(0,0,0,0.22);
        }
        .course-slider-swiper .swiper-pagination-bullet {
          background: #383B43;
          opacity: 1;
          width: 0.75rem;
          height: 0.75rem;
          margin: 0 0.25rem !important;
          transition: background 0.2s, transform 0.2s;
        }
        .course-slider-swiper .swiper-pagination-bullet-active {
          background: #FFD60A;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default CourseSlider;
