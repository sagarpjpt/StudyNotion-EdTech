import React from "react";
import Instructor from "../../../assets/Images/Instructor.png";
import HighlightText from "./HighlightText";
import CTAButton from "./CTAButton";
import { FaArrowRight } from "react-icons/fa";


const InstructorSection = () => {
  return (
    <div className="lg:ml-22">
      <div className="flex flex-col lg:flex-row gap-20 items-center justify-center">
        <div className="shadow-[-10px_-10px_1px_0] shadow-white">
          <img
            src={Instructor}
            alt="img"
            className="shadow-2xl shadow-blue-500 object-contain"
          />
        </div>

        <div className="lg:w-[50%] flex flex-col gap-10">
          <div className="text-4xl font-semibold w-[50%]">
            Become an
            <HighlightText text={"Instructor"} />
          </div>
          <p className="font-medium text-[16px] w-[80%]">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </p>
          <div className="w-fit">
            <CTAButton active={true} linkto={'/signup'}>
            <div className="flex flex-row gap-2">
              Start Learning Today
              <FaArrowRight />
            </div>
          </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
