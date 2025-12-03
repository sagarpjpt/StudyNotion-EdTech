import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import { apiConnector } from "../../../../../services/apiConnector";
import { course_sections } from "../../../../../services/apis";
import { setCourse } from "../../../../../redux/slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";
import Spinner from "../../../../common/Spinner";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl || "");
      setValue("lectureTime", modalData.timeDuration || "");
    } else {
      // clear on add
      setValue("lectureTitle", "");
      setValue("lectureDesc", "");
      setValue("lectureVideo", "");
      setValue("lectureTime", "");
    }
  }, [modalData, view, edit]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl ||
      currentValues.lectureTime !== modalData.timeDuration
    ) {
      return true;
    }
    return false;
  };

  // handle edit subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("subSectionId", modalData._id);
    // controller expects title, timeDuration, description as required
    formData.append("title", currentValues.lectureTitle);
    formData.append("timeDuration", currentValues.lectureTime);
    formData.append("description", currentValues.lectureDesc);

    // video: if user uploaded a file, Upload sets lectureVideo to File; otherwise string
    const videoVal = currentValues.lectureVideo;
    if (videoVal && typeof videoVal !== "string") {
      // file
      formData.append("videoFile", videoVal);
    }

    setLoading(true);
    try {
      const res = await apiConnector(
        "PUT",
        course_sections.EDIT_SUB_SECTION,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res?.data?.success) {
        toast.success(res.data.message || "Lecture updated");
        const updatedSubSection = res.data.updatedSubSection;
        // update course store: find the section and replace the subSection inside it
        const updatedCourseContent = (course.courseContent || []).map(
          (section) => {
            if (String(section._id) !== String(modalData.sectionId))
              return section;
            // map subSection array and replace the edited one
            const updatedSubArr = (section.subSection || []).map((ss) =>
              String(ss._id) === String(updatedSubSection._id)
                ? updatedSubSection
                : ss
            );
            return { ...section, subSection: updatedSubArr };
          }
        );
        dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
        setModalData(null);
      } else {
        toast.error(res?.data?.message || "Failed to update lecture");
      }
    } catch (err) {
      console.error("edit subsection error", err);
      toast.error(err?.response?.data?.message || "Error updating lecture");
    } finally {
      setLoading(false);
    }
  };

  // create or edit flow
  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
        return;
      }
      await handleEditSubsection();
      return;
    }

    // create subsection
    const formData = new FormData();
    formData.append("sectionId", modalData); // modalData is sectionId when adding
    formData.append("title", data.lectureTitle);
    formData.append("timeDuration", data.lectureTime);
    formData.append("description", data.lectureDesc);

    // lectureVideo should be a File (Upload sets file). Controller requires videoFile
    const videoVal = data.lectureVideo;
    if (!videoVal || typeof videoVal === "string") {
      toast.error("Please upload a video file");
      return;
    }
    formData.append("videoFile", videoVal);

    setLoading(true);
    try {
      const res = await apiConnector(
        "POST",
        course_sections.CREATE_SUB_SECTION,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res?.data?.success) {
        toast.success(res.data.message || "Lecture added");
        const updatedSection = res.data.updatedSection;
        // replace the section in courseContent with updatedSection
        const updatedCourseContent = (course.courseContent || []).map(
          (section) =>
            String(section._id) === String(modalData) ? updatedSection : section
        );
        dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
        setModalData(null);
      } else {
        toast.error(res?.data?.message || "Failed to add lecture");
      }
    } catch (err) {
      console.error("create subsection error", err);
      toast.error(err?.response?.data?.message || "Error adding lecture");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-richblack-500 bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="bg-richblack-700 w-full rounded-md p-3 border border-richblack-700 
            placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-blue-200 
            transition text-richblack-5"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTime">
              Lecture Duration (e.g. 00:15:30){" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTime"
              placeholder="Enter duration like 00:10:30 or 10:30"
              {...register("lectureTime", { required: true })}
              className="bg-richblack-700 w-full rounded-md p-3 border border-richblack-700 
            placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-blue-200 
            transition text-richblack-5"
            />
            {errors.lectureTime && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture duration is required
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="resize-x-none min-h-[130px] bg-richblack-700 w-full rounded-md p-3 border border-richblack-700 
            placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-blue-200 
            transition text-richblack-5"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture description is required
              </span>
            )}
          </div>

          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
