import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/core/HomePage/HighlightText.jsx";
import CTAButton from "../components/core/HomePage/CTAButton.jsx";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks.jsx";
import Footer from "../components/common/Footer.jsx";
import TimeLineSection from "../components/core/HomePage/TimeLineSection.jsx";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection.jsx";
import InstructorSection from '../components/core/HomePage/InstructorSection.jsx'
import ExploreMore from "../components/core/HomePage/ExploreMore.jsx";
import ReviewSlider from "../components/common/ReviewSlider.jsx";

const Home = () => {
  return (
    <div>
      {/* section 1 */}
      <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent">
        {/* become an instrutor */}
        <Link to={"/signup"}>
          <div className="group mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit mt-16 p-1 shadow-sm hover:shadow-lg shadow-richblack-500">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* heading */}
        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with <HighlightText text={"Coding Skills"} />
        </div>

        {/* sub heading */}
        <div className="mt-3 text-center text-lg font-bold text-richblack-300 lg:w-[65%]">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        {/* button div */}
        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
            {/* it's children of this component */}
          </CTAButton>
          <CTAButton active={false} linkto={"/signup"}>
            Book a Demo
          </CTAButton>
        </div>

        {/* video  */}
        <div className="mx-3 my-14 shadow-[10px_-5px_50px_-5px] shadow-blue-200 lg:w-[65%]">
          <video
            className="shadow-[10px_10px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* code section 1 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock your
                <HighlightText text={"coding potential"} /> with our online
                courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/signup",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            gradientColor={
              "bg-gradient-to-r from-[#FF0F7B] via-[#F89B29] to-[#FF0F7B]"
            }
          />
        </div>

        {/* code section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-semibold">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead. give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/signup",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            gradientColor={
              "bg-gradient-to-r from-[#0048FF] via-[#0096FF] to-[#00E1FF]"
            }
          />
        </div>

        {/* do it later */}
        <ExploreMore />

      </div>

      {/* section 2 */}
      <div className="bg-white text-richblack-700">

        {/* Explore Full Catagory Section */}
        <div className="homepage_bg h-[310px]">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-5 mx-auto">
            {/* gap using div */}
            <div className="h-[150px]"></div>

            {/* button div */}
            <div className="flex flex-row flex-wrap justify-center gap-7 text-white">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex gap-3 items-center">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Job that is in Demand - Section 1 */}
        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-7">

          <div className="flex lg:flex-row flex-col gap-5 mb-12 mt-[55px] justify-center">
            <div className="text-4xl font-semibold lg:w-[45%]">
              Get the Skills you need for a{" "}
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className="flex flex-col gap-10 lg:w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton>
            </div>
          </div>

          <TimeLineSection />

          <LearningLanguageSection />

        </div>

      </div>

      {/* section 3 */}
      <div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-center gap-8 bg-richblack-900 text-white my-15">

            {/* become an instructor */}
            <InstructorSection />

            {/* review box */}
            <h2 className="text-center text-4xl font-semibold mt-10">Review from Other Learners</h2>

            {/* review slider */}
            <ReviewSlider />

      </div>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Home;
