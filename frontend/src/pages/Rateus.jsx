import React, { useState } from "react";
import ContactDetails from "../components/core/ContactPage/ContactDetails";
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function RateUsComponent({ previousContent }) {
  const [errorRating, setErrorRating] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (index) => {
    setHoverRating(index);
  };

  const handleMouseOut = () => {
    setHoverRating(0);
  };

  const handleClick = (index) => {
    setRating(index);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = () => {
    setErrorRating(false);
    setErrorFeedback(false);
    if (!rating) {
      setErrorRating(true);
    }
    if (!feedback) {
      setErrorFeedback(true);
    } else if (feedback && rating) {
      //   api call to store feedback and rating
      setRating(0);
      setFeedback("");
      toast.success("Thank you for the feedback!");
    }
  };

  return (
    <>
      {/* Feedback & Contact Section */}
      <div className="flex flex-col lg:flex-row  items-start gap-10 mx-auto w-11/12 lg:w-10/12 py-16 lg:py-20 rounded-2xl transition-all duration-300 hover:shadow-[0_6px_40px_rgba(0,0,0,0.4)]">
        {/* Feedback Form */}
        <div className="lg:w-3/5 w-full p-8 bg-richblack-800 border border-richblack-600 rounded-xl shadow-md transition-all duration-300 hover:border-yellow-300 hover:shadow-[0_0_20px_rgba(255,213,0,0.2)]">
          <h2 className="text-3xl font-bold text-center text-richblack-5 mb-3">
            We Value Your Feedback 💬
          </h2>
          <p className="text-center text-richblack-300 text-sm md:text-base mb-3 leading-relaxed">
            Tell us how your experience has been. Your feedback helps us grow
            and improve your learning journey.
          </p>

          {/* Star Rating */}
          <div className="flex justify-center mb-2">
            {[...Array(5)].map((_, index) => {
              const starIndex = index + 1;
              return (
                <span
                  key={starIndex}
                  className={`text-4xl cursor-pointer transition-all duration-300 transform hover:scale-125 ${
                    starIndex <= (hoverRating || rating)
                      ? "text-yellow-300 drop-shadow-[0_0_6px_rgba(255,213,0,0.4)]"
                      : "text-richblack-400 hover:text-yellow-100"
                  }`}
                  onMouseOver={() => handleMouseOver(starIndex)}
                  onMouseOut={handleMouseOut}
                  onClick={() => handleClick(starIndex)}
                >
                  &#9733; {/* star symbol */}
                </span>
              );
            })}
          </div>

          {errorRating && (
            <span className="text-xs text-yellow-100 mb-4 block text-center">
              *Please enter a rating.
            </span>
          )}

          {/* Feedback Textarea */}
          <motion.textarea
            className="w-full h-40 p-3 bg-richblack-700 text-richblack-5 placeholder:text-richblack-400 border border-richblack-600 rounded-lg shadow-sm focus:outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300 transition-all duration-200 resize-none"
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={handleFeedbackChange}
            initial={{ borderColor: "#6f81a5" }}
            whileFocus={{
              borderColor: "#FFD60A",
              boxShadow: "0 0 8px rgba(255, 213, 0, 0.4)",
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />

          {errorFeedback && (
            <label className="text-xs text-yellow-100 mt-1 block text-center">
              *Please enter feedback.
            </label>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <button
              className="w-full py-3 bg-yellow-50 text-black font-semibold text-lg rounded-lg shadow-md transition-all duration-300 hover:scale-[0.97] hover:shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] active:scale-[0.95]"
              onClick={handleSubmit}
            >
              Submit Feedback
            </button>
          </div>
        </div>

        {/* Contact Details */}
        <div className="lg:w-2/5 w-full mt-8 lg:mt-0">
          <ContactDetails />
        </div>
      </div>

      {/* Review Section */}
      <div className="text-richblack-5 relative flex flex-col items-center justify-center w-11/12 lg:w-10/12 mx-auto my-16 py-16">
        <h1 className="text-4xl font-bold text-center text-richblack-5 mb-8 tracking-wide">
          Happy & Satisfied Learners 💛
        </h1>
        <ReviewSlider />
      </div>

      <Footer />
    </>
  );
}

export default RateUsComponent;
