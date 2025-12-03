// src/pages/CourseDetails.jsx
import React, { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import ConfirmationModal from "../components/common/ConfirmationModal";
import Footer from "../components/common/Footer";
import RatingStars from "../components/common/RatingStars";
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import { formatDate } from "../utils/formatDate";
import { apiConnector } from "../services/apiConnector";
import { payment } from "../services/apis";
import { courses, ratingReview } from "../services/apis";
import Error from "./Error";
import Spinner from "../components/common/Spinner";
import checkLogin from "../services/checkLogin";
import { openRazorpayCheckout } from "../services/payment";



function CourseDetails() {
  // const { user } = useSelector((state) => state.profile);
  // const { paymentLoading } = useSelector((state) => state.course || {});
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  // course id from route
  const { courseId } = useParams();

  // local state
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState([]);

  const [response, setResponse] = useState(null); // will hold the course object
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState(null);

  // fetch course details
  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const res = await apiConnector(
          "GET",
          courses.GET_COURSE_DETAILS + courseId,
          null,
          { signal: controller.signal }
        );

        if (!cancelled && res?.data?.success) {
          setResponse(res.data.course || null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("fetchCourseDetails error:", err);
          setResponse(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCourseDetails();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [courseId]);

  // fetch average rating - only when we have courseId (or response._id)
  useEffect(() => {
    if (!courseId) return;

    let cancelled = false;
    const controller = new AbortController();

    const getAvgRR = async () => {
      try {
        const res = await apiConnector(
          "GET",
          ratingReview.GET_AVG_RR + courseId,
          null,
          { signal: controller.signal }
        );
        if (!cancelled && res?.data?.success) {
          setAvgReviewCount(Number(res.data.averageRating || 0));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("getAvgRR error:", err);
        }
      }
    };

    getAvgRR();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [courseId]);

  // compute total number of lectures
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  useEffect(() => {
    if (!response?.courseContent) {
      setTotalNoOfLectures(0);
      return;
    }
    let lectures = 0;
    response.courseContent.forEach((sec) => {
      lectures += Array.isArray(sec.subSection) ? sec.subSection.length : 0;
    });
    setTotalNoOfLectures(lectures);
  }, [response]);

  // buy course
  const handleBuyCourse = async () => {
    const { loggedIn, user: loggedUser } = await checkLogin();
    console.log(loggedUser)

    if (!loggedIn) {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to purchase this course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
      return;
    }

    if (loggedUser.role === "Instructor") {
      toast.error("Instructors cannot buy courses.");
      return;
    }

    try{

      console.log("Sending to backend:", {
        courseId,
        userId: loggedUser.userId
      });
      const res = await apiConnector('POST', payment.CAPTURE, { courseId, userId: loggedUser.userId })

      if(res?.data?.success) {
        openRazorpayCheckout(res.data, loggedUser, navigate);
      }
    } catch {

    }

    // later you'll implement buyCourse
    console.log("Proceed to buy course");
  };

  // 
  const handleActive = (id) => {
    setIsActive((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id) // remove
        : [...prev, id] // add
    );
  };


  // page loading & error handling
  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <Spinner />
      </div>
    );
  }

  if (!response) {
    return <Error />;
  }

  // destructure course fields (safe defaults)
  const {
    _id,
    courseName = "",
    courseDescription = "",
    thumbnail = "",
    price = 0,
    whatYouWillLearn = "",
    courseContent = [],
    ratingAndReviews = [],
    tag = [],
    instructor = { firstName: "", lastName: "", image: "" },
    studentsEnrolled = [],
    createdAt,
  } = response;

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        {/* HERO */}
        <div className="lg:w-10/12 mx-auto px-4 2xl:relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start py-8">
            {/* Left/Main column */}
            <div className="col-span-2">
              <div className="mb-6">
                <img
                  src={thumbnail}
                  alt="course thumbnail"
                  className="w-full rounded-2xl object-cover shadow-md"
                  style={{ maxHeight: "420px", width: "100%" }}
                />
              </div>

              <div className="bg-transparent">
                <h1 className="text-4xl sm:text-[42px] font-bold text-richblack-5">
                  {courseName}
                </h1>
                <p className="mt-3 text-richblack-200 leading-relaxed">
                  {courseDescription}
                </p>

                {/* TAGS */}
                {tag.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tag.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-sm bg-richblack-700 text-richblack-25 border border-richblack-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-yellow-25 font-semibold">
                    {avgReviewCount ? avgReviewCount.toFixed(1) : "0.0"}
                  </span>
                  <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
                  <span className="text-richblack-300">
                    ({ratingAndReviews?.length ?? 0} reviews)
                  </span>
                  <span className="mx-2 text-richblack-400">•</span>
                  <span className="text-richblack-300">
                    {studentsEnrolled?.length ?? 0} students enrolled
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-richblack-300">
                  <div className="flex items-center gap-2">
                    <BiInfoCircle />
                    <span>Created at {formatDate(createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineGlobeAlt />
                    <span>English</span>
                  </div>
                </div>

                <div className="mt-6 border border-richblack-600 rounded-xl p-6 bg-white/5 backdrop-blur-sm">
                  <div className="text-lg font-semibold text-richblack-5 mb-3">What you'll learn</div>
                  <div className="prose prose-invert max-w-none text-richblack-200">
                    <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="mt-8 max-w-[830px]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-richblack-5">Course Content</h2>
                  <button
                    className="text-yellow-25 text-sm"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>

                <div className="text-sm text-richblack-300 mb-4 flex gap-4">
                  <span>{courseContent.length} section(s)</span>
                  <span>{totalNoOfLectures} lecture(s)</span>
                </div>

                <div className="space-y-3">
                  {courseContent?.map((section, index) => (
                    <CourseAccordionBar
                      key={section._id || index}
                      course={section}
                      isActive={isActive}
                      handleActive={handleActive}
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold text-richblack-5">Author</h3>
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={
                        instructor?.image ||
                        `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                      }
                      alt={`${instructor.firstName} ${instructor.lastName}`}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-lg font-medium text-richblack-5">
                        {instructor.firstName} {instructor.lastName}
                      </div>
                      <p className="text-richblack-300 mt-1">
                        {instructor?.additionalDetails?.about || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TOP REVIEWS */}
              {ratingAndReviews.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-2xl font-semibold text-richblack-5 mb-4">Top Reviews</h3>

                  <div className="space-y-4">
                    {ratingAndReviews
                      .slice(0, 3)                // Take top 2–3 reviews
                      .sort((a, b) => b.rating - a.rating) // Highest rating first
                      .map((rr) => (
                        <div
                          key={rr._id}
                          className="p-4 rounded-xl border border-richblack-600 bg-richblack-700"
                        >
                          {/* User + Rating */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-richblack-900 font-bold">
                                {rr.user.firstName.charAt(0).toUpperCase()}
                              </div>
                              <p className="text-richblack-5 font-medium">
                                {rr.user.firstName} {rr.user.lastName}
                              </p>
                            </div>

                            <p className="text-yellow-50 text-lg">
                              {"★".repeat(rr.rating)}
                              {"☆".repeat(5 - rr.rating)}
                            </p>
                          </div>

                          {/* Review text */}
                          <p className="text-richblack-25 text-sm">{rr.review}</p>
                        </div>
                      ))}
                  </div>

                  {/* SHOW ALL REVIEWS BUTTON */}
                  {ratingAndReviews.length > 3 && (
                    <button
                      onClick={() => window.scrollTo({ top: 999999, behavior: "smooth" })}
                      className="mt-5 px-4 py-2 text-sm bg-blue-200 text-richblack-900 rounded-lg shadow hover:bg-blue-300 transition"
                    >
                      Show All Reviews
                    </button>
                  )}
                </div>
              )}


            </div>

            {/* right sidebar (sticky on lg) */}
            <aside className="col-span-1 min-w-[350px] lg:w-[350px]">
              <div className="lg:sticky lg:top-24">
                <CourseDetailsCard
                  course={response} // pass the course object directly
                  setConfirmationModal={setConfirmationModal}
                  handleBuyCourse={handleBuyCourse}
                />

                {/* small note under card */}
                <div className="mt-4 text-sm text-richblack-400 text-center">
                  <p>Secure payment by your chosen gateway</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />

      {/* confirmation modal (if any) */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

export default CourseDetails;
