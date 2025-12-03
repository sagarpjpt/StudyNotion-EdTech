import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import IconBtn from "../../common/IconBtn";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    (() => {
      if (!courseSectionData.length) return;
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection.findIndex((data) => data._id === subSectionId);
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id;
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
      setVideoBarActive(activeSubSectionId);
    })();
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] md:w-[330px] md:max-w-[360px] flex-col border-r border-richblack-700 bg-richblack-800 shadow-[2px_0_8px_rgba(0,0,0,0.2)]">
        {/* Header */}
        <div className="mx-5 flex flex-col gap-3 border-b border-richblack-600 py-6 text-richblack-25">
          <div className="flex w-full items-center justify-between">
            {/* Back button */}
            <div
              onClick={() => navigate(`/dashboard/enrolled-courses`)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-richblack-700 
        text-richblack-200 hover:bg-richblack-600 hover:scale-95 transition-all shadow-inner cursor-pointer"
              title="Back"
            >
              <IoIosArrowBack size={22} />
            </div>

            {/* Add review button */}
            <IconBtn
              text="Add Review"
              customClasses="ml-auto !py-2 !px-4 !text-sm !rounded-lg"
              onclick={() => setReviewModal(true)}
            />
          </div>

          {/* Course Info */}
          <div className="flex flex-col">
            <p className="text-[1.05rem] font-semibold leading-5 tracking-wide">
              {courseEntireData?.courseName}
            </p>
            <p className="text-xs font-medium text-richblack-400">
              {completedLectures?.length} / {totalNoOfLectures} Completed
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-track-richblack-900 scrollbar-thumb-richblack-600">
          {courseSectionData.map((course, idx) => (
            <div key={idx} className="mt-2 text-richblack-5">
              {/* Section Header */}
              <div
                className="flex items-center justify-between bg-richblack-700 px-3 py-4 border-b border-richblack-600 mx-4 rounded-lg
          hover:bg-richblack-600 cursor-pointer transition"
                onClick={() => setActiveStatus(course?._id)}
              >
                <div className="w-[70%] text-sm font-semibold tracking-wide ">
                  {course?.sectionName}
                </div>

                <span
                  className={`${
                    activeStatus === course?._id ? "rotate-180" : "rotate-0"
                  } 
            transition-transform duration-300`}
                >
                  <BsChevronDown size={18} />
                </span>
              </div>

              {/* Subsections */}
              {activeStatus === course?._id && (
                <div className="flex flex-col transition-all duration-300 bg-richblack-800/60 mx-4">
                  {course.subSection.map((topic, i) => {
                    const isActive = videoBarActive === topic._id;
                    const isCompleted = completedLectures.includes(topic._id);

                    return (
                      <div
                        key={i}
                        onClick={() => {
                          navigate(
                            `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                          );
                          setVideoBarActive(topic._id);
                        }}
                        className={`flex items-center gap-5 px-6 py-3 text-sm cursor-pointer rounded-lg mt-1
                    ${
                      isActive
                        ? "bg-yellow-200 text-richblack-800 font-semibold shadow"
                        : "hover:bg-richblack-700/70 text-richblack-200"
                    }
                  `}
                      >
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          readOnly
                          className="h-4 w-4 cursor-pointer accent-yellow-300"
                        />
                        <span>{topic.title}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
