import React from "react";
import { FaUsers } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  return <>
    {currentCard === cardData.heading ? (
        <div className="bg-white shadow-[8px_8px_0px_0px] shadow-amber-300 text-richblack-900 p-3 flex flex-col justify-between">
            <h1 className="font-semibold mb-2 mt-1">{cardData.heading}</h1>
            <p className="text-richblack-400 mb-8">{cardData.description}</p>
            <div className="flex justify-between mb-1 gap-10">
                <p className="text-blue-400 flex gap-3 items-center">
                    <FaUsers className="text-xl"/>
                    {cardData.level}
                </p>
                <p className="text-blue-400 flex gap-1 items-center">
                    <FaUserTie className="text-lg" />
                    {cardData.lessonNumber}
                    <span>Lessons</span>
                </p>
            </div>
        </div>
    ) : (
        <div className="text-white p-3 bg-richblack-700 flex flex-col justify-between">
            <h1 className="font-semibold mb-2 mt-1">{cardData.heading}</h1>
            <p className="text-richblack-400 mb-8">{cardData.description}</p>
            <div className="flex justify-between mb-2 gap-10">
                <p className="text-blue-300 flex gap-3 items-center">
                    <FaUsers className="text-xl"/>
                    {cardData.level}
                </p>
                <p className="text-blue-300 flex gap-1 items-center">
                    <FaUserTie className="text-lg" />
                    {cardData.lessonNumber}
                    <span>Lessons</span>
                </p>
            </div>
        </div>
    )}
    </>;
};

export default CourseCard;
