import React, { useState } from "react";
import { HomePageExplore } from "../../../data/home-page-explore";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";

const ExploreMore = () => {
  const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
  ];

  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div className="relative w-11/12 max-w-maxContent mb-5 mx-auto">
      <div className="text-4xl font-semibold text-center">
        Unlock the <HighlightText text={"Power of Code"} />
      </div>

      <p className="text-center text-richblack-300 text-md mt-3 font-semibold">
        Learn to build anything you can imagine
      </p>

      <div className="w-full my-5 flex justify-center">
        <div className="max-w-full overflow-x-scroll px-4 scrollbar-hide">
          <div className="inline-flex p-1 bg-richblack-700 rounded-full border-2 border-richblack-300 whitespace-nowrap">
            {tabsName.map((element, index) => (
              <div
                key={index}
                className={`text-sm sm:text-[18px] text-center ${
                  currentTab === element
                    ? "bg-richblack-900 text-richblack-5 font-medium"
                    : "text-richblack-200"
                } cursor-pointer rounded-full transition-all duration-200 hover:bg-richblack-900 hover:text-richblack-5 sm:px-7 px-4 py-2`}
                onClick={() => setMyCards(element)}
              >
                {element}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:h-[200px]"></div>

      {/* course card */}
      <div className="lg:absolute lg:bottom-[-100px] flex lg:flex-row gap-8 flex-col lg:left-[50%] lg:translate-x-[-50%]">
        {courses.map((element, index) => {
          return (
            <CourseCard
              key={index}
              cardData={element}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMore;
