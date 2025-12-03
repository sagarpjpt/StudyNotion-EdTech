import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm";
import CourseInformationForm from "./CourseInformation/CourseInformationForm";
import PublishCourse from "./PublishCourse";

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course);

  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ];

  return (
    <>
      {/* STEPPER */}
      <div className="w-full flex justify-between mb-10 px-4 relative border-2">

        {steps.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-col items-center text-center w-full relative"
          >
            {/* Circle */}
            <div
              className={`grid place-items-center w-[38px] h-[38px] rounded-full border-2 transition-all duration-300
              ${
                step === item.id
                  ? "border-yellow-50 bg-yellow-900 text-yellow-50 shadow-[0_0_10px_rgba(255,255,0,0.2)]"
                  : "border-richblack-600 bg-richblack-800 text-richblack-300"
              }
              ${step > item.id && "bg-yellow-50 text-richblack-900"}
            `}
            >
              {step > item.id ? (
                <FaCheck className="text-richblack-900" />
              ) : (
                item.id
              )}
            </div>

            {/* Title */}
            <p
              className={`mt-3 text-sm font-medium transition-all ${
                step >= item.id ? "text-richblack-5" : "text-richblack-500"
              }`}
            >
              {item.title}
            </p>

            {/* Connector line */}
            {index !== steps.length - 1 && (
              <div
                className={`absolute top-[19px] right-[-50%] w-[87%] border-b-3 border-dashed transition-all
                ${
                  step > item.id
                    ? "border-yellow-50"
                    : "border-richblack-600"
                }`}
              ></div>
            )}
          </div>
        ))}

      </div>

      {/* Render Forms */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  );
}
