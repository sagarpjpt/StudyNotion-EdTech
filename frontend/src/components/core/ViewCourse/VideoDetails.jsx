import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { apiConnector } from "../../../services/apiConnector";
import { course_sections } from "../../../services/apis";
import IconBtn from "../../common/IconBtn";
import { updateCompletedLectures } from "../../../redux/slices/viewCourseSlice";
import { BsChevronDown } from "react-icons/bs";

export default function VideoDetails() {
  const { courseId, sectionId, subSectionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [videoData, setVideoData] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const toggleSection = (sectionId) => {
    setActiveSection((prevSection) =>
      prevSection === sectionId ? null : sectionId
    );
  };

  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const playerRef = useRef(null);
  useEffect(() => {
    let interval = null;
    let attempts = 0;
    const maxAttempts = 20; // try for around 4 seconds

    interval = setInterval(() => {
      const playerObj = playerRef.current;

      if (playerObj?.plyr && playerObj.plyr.ready) {
        // console.log(" Plyr is ready:", playerObj.plyr);

        const player = playerObj.plyr;
        const handleEnded = () => setVideoEnded(true);

        player.on("ended", handleEnded);

        clearInterval(interval);
        interval = null;

        return () => {
          player.off("ended", handleEnded);
        };
      }

      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        interval = null;
        console.warn("Plyr never became ready.");
      }
    }, 200);

    return () => interval && clearInterval(interval);
  }, [videoData]);

  // -------------------------------
  // Load Video Data
  // -------------------------------
  useEffect(() => {
    if (!courseSectionData.length) return;

    const section = courseSectionData.find((sec) => sec._id === sectionId);
    if (!section) return;

    const sub = section.subSection.find((lec) => lec._id === subSectionId);
    if (!sub) return;

    setVideoData(sub);
    setVideoEnded(false);
  }, [courseSectionData, sectionId, subSectionId, location.pathname]);

  // -------------------------------
  // Video Controls Logic
  // -------------------------------

  const isFirstVideo = () => {
    const secIdx = courseSectionData.findIndex((sec) => sec._id === sectionId);
    const subIdx = courseSectionData[secIdx]?.subSection.findIndex(
      (lec) => lec._id === subSectionId
    );

    return secIdx === 0 && subIdx === 0;
  };

  const isLastVideo = () => {
    const secIdx = courseSectionData.findIndex((sec) => sec._id === sectionId);
    const subIdx = courseSectionData[secIdx]?.subSection.findIndex(
      (lec) => lec._id === subSectionId
    );

    const lastSection = secIdx === courseSectionData.length - 1;
    const lastLecture =
      subIdx === courseSectionData[secIdx]?.subSection?.length - 1;

    return lastSection && lastLecture;
  };

  const goToNextVideo = () => {
    const secIdx = courseSectionData.findIndex((sec) => sec._id === sectionId);
    const subIdx = courseSectionData[secIdx].subSection.findIndex(
      (lec) => lec._id === subSectionId
    );

    const isLastSub =
      subIdx === courseSectionData[secIdx].subSection.length - 1;

    if (!isLastSub) {
      const nextSubId = courseSectionData[secIdx].subSection[subIdx + 1]._id;

      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubId}`
      );
      return;
    }

    // go to next section
    const nextSec = courseSectionData[secIdx + 1];
    navigate(
      `/view-course/${courseId}/section/${nextSec._id}/sub-section/${nextSec.subSection[0]._id}`
    );
  };

  const goToPrevVideo = () => {
    const secIdx = courseSectionData.findIndex((sec) => sec._id === sectionId);
    const subIdx = courseSectionData[secIdx].subSection.findIndex(
      (lec) => lec._id === subSectionId
    );

    if (subIdx > 0) {
      const prevSubId = courseSectionData[secIdx].subSection[subIdx - 1]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubId}`
      );
      return;
    }

    // go to previous section
    const prevSec = courseSectionData[secIdx - 1];
    const lastLecture = prevSec.subSection[prevSec.subSection.length - 1];

    navigate(
      `/view-course/${courseId}/section/${prevSec._id}/sub-section/${lastLecture._id}`
    );
  };

  // -------------------------------
  // MARK AS COMPLETE
  // -------------------------------
  const handleComplete = async () => {
    setLoading(true);

    // TODO: integrate API
    try {
      const res = await apiConnector(
        "POST",
        course_sections.MARK_LEC_COMPLETED,
        {
          courseId,
          lectureId: subSectionId,
        }
      );
      if (res?.data?.success) {
        dispatch(updateCompletedLectures(subSectionId));
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Plyr Player Configuration
  // -------------------------------
  const plyrSource = videoData
    ? {
        type: "video",
        sources: [
          {
            src: videoData.videoUrl,
            type: "video/mp4",
          },
        ],
      }
    : null;

  const plyrOptions = {
    controls: [
      "play",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "settings",
      "fullscreen",
    ],
    settings: ["captions", "quality", "speed"],
    speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
    autoplay: false,
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* ------------------ VIDEO PLAYER ------------------ */}
      {videoData ? (
        <div className="relative w-full">
          <Plyr ref={playerRef} source={plyrSource} options={plyrOptions} />

          {/* ------------------ END OVERLAY (RESTORED) ------------------ */}
          {videoEnded && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm grid place-content-center z-50">
              {/* Mark as Completed */}
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  text={loading ? "Loading..." : "Mark as Completed"}
                  disabled={loading}
                  onclick={handleComplete}
                  customClasses="text-lg px-4 mb-3"
                />
              )}

              {/* Rewatch */}
              <IconBtn
                text="Rewatch"
                onclick={() => {
                  playerRef?.current?.plyr?.restart();
                  setVideoEnded(false);
                }}
                customClasses="text-lg px-4 mb-3"
              />

              {/* Prev / Next */}
              <div className="flex gap-4 justify-center mt-3">
                {!isFirstVideo() && (
                  <button className="blackButton" onClick={goToPrevVideo}>
                    Prev
                  </button>
                )}

                {!isLastVideo() && (
                  <button className="blackButton" onClick={goToNextVideo}>
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <img
          src={courseEntireData.thumbnail}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      )}

      {/* ------------------ TITLE + DESCRIPTION ------------------ */}
      <h1 className="text-xl md:text-3xl font-semibold">{videoData?.title}</h1>

      <p className="text-sm md:text-base text-richblack-300 pb-6">
        {videoData?.description}
      </p>

      {/* ------------------ MOBILE SECTIONS ACCORDION ------------------ */}
      <MobileSectionAccordion
        courseSectionData={courseSectionData}
        activeSection={activeSection}
        toggleSection={toggleSection}
        navigate={navigate}
        courseId={courseId}
      />

      {/* ------------------ PREV / NEXT BUTTONS (ALWAYS VISIBLE) ------------------ */}
      <div className="flex justify-between mt-4">
        {!isFirstVideo() && (
          <button
            className="blackButton bg-richblack-600 px-4 py-2 rounded-md cursor-pointer"
            onClick={goToPrevVideo}
          >
            Prev
          </button>
        )}
        {!completedLectures.includes(subSectionId) && (
          <IconBtn
            text={loading ? "Loading..." : "Mark as Completed"}
            disabled={loading}
            onclick={handleComplete}
            customClasses="px-4 py-2"
          />
        )}
        {!isLastVideo() && (
          <button
            className="blackButton bg-richblack-600 px-4 py-2 rounded-md cursor-pointer"
            onClick={goToNextVideo}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

const MobileSectionAccordion = ({
  courseSectionData,
  activeSection,
  toggleSection,
  navigate,
  courseId,
}) => {
  return (
    <div className="md:hidden">
      {courseSectionData.map((section) => (
        <div key={section._id}>
          {/* Section Header */}
          <button
            className="w-full bg-richblack-700 p-3 text-left rounded-md flex justify-between items-center mb-3"
            onClick={() => toggleSection(section._id)}
          >
            {section.sectionName}
            <BsChevronDown
              className={`transition-transform ${
                activeSection === section._id ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Subsections */}
          {activeSection === section._id && (
            <div className="bg-richblack-800 mb-2 p-2 rounded-md">
              {section.subSection.map((topic) => (
                <p
                  key={topic._id}
                  onClick={() =>
                    navigate(
                      `/view-course/${courseId}/section/${section._id}/sub-section/${topic._id}`
                    )
                  }
                  className="text-sm p-2 rounded-md hover:bg-richblack-700"
                >
                  {topic.title}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
