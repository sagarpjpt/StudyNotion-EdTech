import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timeLineImage from '../../../assets/Images/TimelineImage.png'

const TimeLineSection = () => {
  const timeLine = [
    {
      Logo: Logo1,
      heading: "Leadership",
      Description: "Fully committed to the success company",
    },
    {
      Logo: Logo2,
      heading: "Responsibility",
      Description: "Students will always be our top priority",
    },
    {
      Logo: Logo3,
      heading: "Flexibility",
      Description: "The ability to switch is an important skill",
    },
    {
      Logo: Logo4,
      heading: "Solve the problem",
      Description: "Code you way to a solution",
    },
  ];

  return (
    <div className="flex gap-5 lg:flex-row flex-col items-center justify-center">
      {/* left box */}
      <div className="flex flex-col gap-5 lg:w-[45%]">
        {timeLine.map((ele, ind) => {
          return (
            <div key={ind} className="relative flex flex-row gap-5 items-center">
              <div className="w-[50px] h-[50px] bg-white flex items-center justify-center">
                <img src={ele.Logo} alt="" />
              </div>
              <div>
                <h2 className="font-semibold text-[18px]">{ele.heading}</h2>
                <p className="text-base">{ele.Description}</p>
              </div>
              {(ind < timeLine.length-1) ? (
                <div className="absolute h-10 lg:h-5 w-1 bg-gray-300 left-5.5 top-14 lg:top-12.5"></div>
              ) : (
                <div className="hidden"></div>
              ) }
            </div>
          );
        })}
      </div>

      {/* right box */}
        <div className="relative shadow-2xl shadow-blue-200">

            <img src={timeLineImage} alt="timeline img" className="shadow-white object-cover h-fit" />

            <div className="absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7 left-[50%] translate-x-[-50%] -translate-y-12.5">

                <div className="flex items-center gap-5 border-r border-caribbeangreen-300 px-7">
                    <p className="text-3xl font-bold">10</p>
                    <p className="text-caribbeangreen-300 text-sm">Years of Experience</p>
                </div>

                <div className="flex gap-7 items-center px-7">
                    <p className="text-3xl font-bold">250</p>
                    <p className="text-caribbeangreen-300 text-sm">TYPE OF COURSES</p>
                </div>

            </div>

        </div>

    </div>
  );
};

export default TimeLineSection;
