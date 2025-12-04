import frameImage from "../../../assets/Images/frame.png";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { FcGoogle } from "react-icons/fc";

function Template({ title, desc1, desc2, image, formtype, setLoading}) {
  return (
    <div className="text-white w-11/12 sm:max-w-[1160px] flex flex-wrap-reverse sm:flex-nowrap items-center justify-center sm:justify-between py-12 mx-auto gap-10 sm:gap-x-12 overflow-x-hidden">
      {/* left part div */}
      <div className="w-11/12 max-w-[450px]">
        <h1 className="font-semibold text-[1.875rem] leading-[2.375rem]">
          {title}
        </h1>

        <p className="text-[1.125rem] leading-[1.625rem] mt-4">
          <span className="text-custom-text">{desc1}</span>
          <br />
          <span className="text-custom-text-2 italic">{desc2}</span>
        </p>

        {/* displaying the signup form or login form */}
        {formtype === "signup" ? (
          <SignupForm setLoading={setLoading} />
        ) : (
          <LoginForm setLoading={setLoading} />
        )}

        {/* OR text */}
        {/* <div className="flex w-full items-center my-4 gap-x-2">
          <div className="w-full h-[2px] bg-richblack-700"></div>
          <p className="text-richblack-700 font-medium leading-[1.375rem]">
            OR
          </p>
          <div className="w-full h-[2px] bg-richblack-700"></div>
        </div> */}

        {/* signup signin using google TODO task */}
        {/* <div>
          {formtype === "signup" ? (
            <button
              className="w-full flex justify-center items-center 
                    rounded-[8px] font-medium text-custom-text border border-richblack-700 px-[12px] py-[8px]
                    gap-x-2 mt-6 capitalize"
            >
              <FcGoogle />
              sign up with google
            </button>
          ) : (
            <button
              className="w-full flex justify-center items-center 
                    rounded-[8px] font-medium text-custom-text border border-richblack-700 px-[12px] py-[8px]
                    gap-x-2 mt-6 capitalize"
            >
              <FcGoogle />
              sign in with google
            </button>
          )}
        </div> */}
      </div>

      {/* right part img div */}
      <div className="relative w-11/12 max-w-[450px]">
        <img
          src={frameImage}
          alt="Pattern"
          width={558}
          height={584}
          loading="lazy"
          className=""
        />
        <img
          src={image}
          alt="img"
          width={558}
          height={584}
          loading="lazy"
          className="absolute -top-5 -left-5"
        />
      </div>
    </div>
  );
}

export default Template;
