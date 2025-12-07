import { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";

import { apiConnector } from "../../../../services/apiConnector";
import { profile } from "../../../../services/apis";
import IconBtn from "../../../common/IconBtn";
import toast from "react-hot-toast";
import Spinner from "../../../common/Spinner";

export default function ChangeProfilePicture({ user, setUser }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // // console.log(file)
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileUpload = async () => {
    try {
      // console.log("uploading...");
      setLoading(true);
      const formData = new FormData();
      formData.append("displayPicture", imageFile);
      // // console.log("FormData contents:");
      // for (let pair of formData.entries()) {
      //   // console.log(pair[0], pair[1]);
      // }
      const res = await apiConnector("PUT", profile.UPDATE_DP, formData, {
        "Content-Type": "multipart/form-data",
      });
      if (res?.data?.success) {
        toast.success("Profile Pic Updated!");
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      // console.log("ERROR MESSAGE - ", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  if (loading) return <Spinner />;

  return (
    <>
      <div
        className="flex items-center justify-between 
                rounded-lg border border-richblack-700 
                bg-richblack-800 p-8 lg:p-10 
                shadow-[0_0_20px_rgba(0,0,0,0.25)] 
                transition-all duration-300 hover:border-richblack-600"
      >
        <div className="flex items-center gap-x-6 w-full">
          {/* PROFILE IMAGE */}
          <img
            src={previewSource || user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[75px] lg:w-[90px] rounded-full object-cover 
                 ring-2 ring-richblack-600 shadow-md"
          />

          <div className="space-y-3">
            <p className="text-richblack-100 text-lg font-medium">
              Change Profile Picture
            </p>

            <div className="flex flex-row gap-4">
              {/* FILE INPUT */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif, image/jpeg"
              />

              {/* SELECT BUTTON */}
              <button
                onClick={handleClick}
                disabled={loading}
                className="cursor-pointer rounded-md bg-richblack-700 
                     py-2 px-5 font-semibold text-richblack-50 
                     hover:bg-richblack-600 transition-all duration-200
                     disabled:opacity-50"
              >
                Select
              </button>

              {/* UPLOAD BUTTON */}
              <IconBtn
                text={loading ? "Uploading..." : "Upload"}
                onclick={handleFileUpload}
                customClasses="hover:scale-95 transition-all duration-200 !px-3 !py-2 text-sm"
              >
                {!loading && (
                  <FiUpload className="text-sm lg:text-lg text-richblack-900" />
                )}
              </IconBtn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
