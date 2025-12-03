import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addToCart } from "../../../redux/slices/cartSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import checkLogin from "../../../services/checkLogin";

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course;

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleAddToCart = async () => {
    const { loggedIn, user: loggedUser } = await checkLogin();

    if (!loggedIn) {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to add items to your cart.",
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

    dispatch(addToCart(course)); 
  };

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-2xl bg-richblack-700 p-4 text-richblack-5 shadow-lg transition-transform duration-200`}
      >
        {/* Course Image */}
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="w-full max-h-[300px] rounded-2xl object-cover md:max-w-full aspect-video overflow-hidden"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Rs. {CurrentPrice}
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="w-full py-3 rounded-md bg-yellow-25 text-richblack-900 font-semibold shadow-md hover:shadow-lg transform transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-100"
              onClick={
                user && course?.studentsEnrolled.includes(user?.userId)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
              {user && course?.studentsEnrolled.includes(user?.userId)
                ? "Go To Course"
                : "Buy Now"}
            </button>
            {(!user || !course?.studentsEnrolled.includes(user?.userId)) && (
              <button
                onClick={handleAddToCart}
                className="w-full py-3 rounded-md border border-richblack-600 text-richblack-5 bg-transparent hover:bg-richblack-800 transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                Add to Cart
              </button>
            )}
          </div>
          <div>
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              This Course Requires :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2 items-start`} key={i}>
                    <BsFillCaretRightFill className="mt-1 text-yellow-25" />
                    <span className="">{item}</span>
                  </p>
                );
              })}
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-2 px-4 rounded-md bg-transparent hover:bg-yellow-900 hover:text-yellow-25 text-yellow-100 transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-100"
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetailsCard;
