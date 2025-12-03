
import React from "react";

const Spinner = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-richblack-900">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-yellow-50 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-richblack-200 mt-4 text-sm lg:text-md tracking-wide">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default Spinner;
