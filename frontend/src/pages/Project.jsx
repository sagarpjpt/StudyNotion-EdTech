import React from "react";
import Footer from "../components/common/Footer";
import image1 from "../assets/Images/image1.png";
import image2 from "../assets/Images/image2.jpg";
import image3 from "../assets/Images/image3.webp";
import image4 from "../assets/Images/image4.jpg";
import image5 from "../assets/Images/image5.jpg";
import image6 from "../assets/Images/image6.jpg";
import image7 from "../assets/Images/image7.jpeg";
import image8 from "../assets/Images/image8.webp";
import image9 from "../assets/Images/image9.webp";

const pythonProjects = [
  {
    title: "AI-Powered Mental Health Bot",
    description: "A chatbot that provides mental health support using AI technology.",
    image: image1,
  },
  {
    title: "Secure Banking System",
    description: "A secure banking application with OTP verification and various banking features.",
    image: image3,
  },
  {
    title: "Personal Finance Tracker",
    description: "A tool to track and manage personal finances, including expenses and savings.",
    image: image5,
  },
];

const jsProjects = [
  {
    title: "E-learning Platform",
    description: "An innovative platform for online education offering cutting-edge courses.",
    image: image2,
  },
  {
    title: "Community Review Website",
    description: "A website where users can form a community to review different products and offer guidance.",
    image: image4,
  },
  {
    title: "Recipe Sharing Platform",
    description: "A platform for users to share and discover new recipes.",
    image: image6,
  },
];

const javaProjects = [
  {
    title: "Fitness Tracker",
    description: "An application to track workouts, monitor progress, and set fitness goals.",
    image: image7,
  },
  {
    title: "Travel Itinerary Planner",
    description: "A tool to plan and organize travel itineraries, including activities and accommodations.",
    image: image8,
  },
  {
    title: "Online Marketplace",
    description: "A platform for buying and selling products online with user reviews and ratings.",
    image: image9,
  },
];

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-richblack-800 border border-richblack-600 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,213,0,0.25)]">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 hover:scale-105"
      />
      <div className="p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-yellow-50 mb-2">{project.title}</h3>
        <p className="text-richblack-200 leading-relaxed text-sm sm:text-base">
          {project.description}
        </p>
      </div>
    </div>
  );
};

const Projects = () => {
  return (
    <>
      <div className="w-11/12 sm:w-11/12 lg:w-10/12 mx-auto py-16">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 text-richblack-5">
          <span className="">Our Learning Projects</span>
        </h1>

        {/* ========== PYTHON PROJECTS ========== */}
        <section className="my-14">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-richblack-5 border-l-4 border-yellow-50 pl-4">
            1. Python Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pythonProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-[1px] w-full bg-richblack-600 my-16"></div>

        {/* ========== JAVASCRIPT PROJECTS ========== */}
        <section className="my-14">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-richblack-5 border-l-4 border-yellow-50 pl-4">
            2. JavaScript / React Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {jsProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-[1px] w-full bg-richblack-600 my-16"></div>

        {/* ========== JAVA PROJECTS ========== */}
        <section className="my-14">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-richblack-5 border-l-4 border-yellow-50 pl-4">
            3. Java Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {javaProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Projects;
