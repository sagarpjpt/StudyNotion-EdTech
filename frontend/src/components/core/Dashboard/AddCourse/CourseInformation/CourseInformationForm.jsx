import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../common/Spinner";
import { apiConnector } from "../../../../../services/apiConnector";
import { categories } from "../../../../../services/apis";
import { courses } from "../../../../../services/apis";
import { setCourse, setStep } from "../../../../../redux/slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";
import ChipInput from "./ChipInput";
import RequirementsField from "./RequirementsField";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const catRef = useRef(null);

  // fetch categories and if editing course then setValues
  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      if (res?.data?.categories.length > 0) {
        console.log("categories", res?.data?.categories);
        setCourseCategories(res?.data?.categories);
      }
      setLoading(false);
    };
    // if form is in edit mode
    if (editCourse) {
      // console.log("data populated", editCourse)
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      // sync selected category label/id for custom dropdown
      if (course?.category) {
        setSelectedCategoryId(course.category._id || "");
        setSelectedCategoryLabel(course.category.name || "");
      }
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }
    getCategories();
  }, []);

  // close category dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true;
    }
    return false;
  };

  //   handle next button click
  const onSubmit = async (data) => {
    console.log("course info", data);

    // ==============================
    //           EDIT MODE
    // ==============================
    if (editCourse) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
        return;
      }

      const currentValues = getValues();
      const formData = new FormData();

      formData.append("courseId", course._id);

      if (currentValues.courseTitle !== course.courseName) {
        formData.append("courseName", data.courseTitle);
      }
      if (currentValues.courseShortDesc !== course.courseDescription) {
        formData.append("courseDescription", data.courseShortDesc);
      }
      if (currentValues.coursePrice !== course.price) {
        formData.append("price", data.coursePrice);
      }
      if (currentValues.courseTags.toString() !== course.tag.toString()) {
        formData.append("tag", JSON.stringify(data.courseTags));
      }
      if (currentValues.courseBenefits !== course.whatYouWillLearn) {
        formData.append("whatYouWillLearn", data.courseBenefits);
      }
      if (currentValues.courseCategory !== course.category) {
        formData.append("category", data.courseCategory);
      }
      if (
        currentValues.courseRequirements.toString() !==
        course.instructions.toString()
      ) {
        formData.append(
          "instructions",
          JSON.stringify(data.courseRequirements)
        );
      }
      if (currentValues.courseImage !== course.thumbnail) {
        formData.append("thumbnailImage", data.courseImage);
      }

      setLoading(true);
      try {
        const res = await apiConnector("PUT", courses.EDIT_COURSE, formData);

        if (res.data.success) {
          toast.success("Course updated!");
          dispatch(setCourse(res.data.course));
          dispatch(setStep(2));
        } else {
          toast.error(res.data.message || "Failed to update course");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Error updating course");
      }
      setLoading(false);
      return;
    }

    // ==============================
    //        CREATE COURSE
    // ==============================

    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("thumbnailImage", data.courseImage);

    setLoading(true);
    try {
      const res = await apiConnector("POST", courses.CREATE_COURSE, formData);

      if (res.data.success) {
        toast.success("Course created successfully!");
        dispatch(setCourse(res.data.course));
        dispatch(setStep(2));
      } else {
        toast.error(res.data.message || "Could not create course");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating course");
    }
    setLoading(false);
  };

  if (loading) return <Spinner />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-y-6 mt-6 p-6 bg-richblack-900 rounded-lg border border-richblack-700 shadow-sm mb-8"
    >
      {/* Course Title */}
      <label className="flex flex-col gap-1 w-full">
        <p className="text-[1rem] leading-[1.375rem] text-richblack-25 font-medium">
          Course Title <sup className="text-pink-200">*</sup>
        </p>

        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="bg-richblack-800 w-full rounded-md p-3 border border-richblack-700 placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-richblack-5"
        />

        {errors.courseTitle && (
          <span className="text-pink-300 text-xs">
            Course title is required
          </span>
        )}
      </label>

      {/* Short Description */}
      <label className="flex flex-col gap-1 w-full">
        <p className="text-[1rem] leading-[1.375rem] text-richblack-25 font-medium">
          Course Short Description <sup className="text-pink-200">*</sup>
        </p>

        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="bg-richblack-800 rounded-md p-3 min-h-[130px] border border-richblack-700 placeholder-richblack-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-richblack-5"
        />

        {errors.courseShortDesc && (
          <span className="text-pink-300 text-xs">
            Course description is required
          </span>
        )}
      </label>

      {/* Course Price */}
      <label className="flex flex-col gap-1 w-full">
        <p className="text-[1rem] leading-[1.375rem] text-richblack-25 font-medium">
          Course Price <sup className="text-pink-200">*</sup>
        </p>

        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              pattern: { value: /^(0|[1-9]\d*)(\.\d+)?$/ },
            })}
            className="bg-richblack-800 w-full rounded-md p-3 pl-12 border border-richblack-700 placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-richblack-5"
          />

          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-richblack-400" />
        </div>

        {errors.coursePrice && (
          <span className="text-pink-300 text-xs">
            Course price is required
          </span>
        )}
      </label>

      {/* Course Category */}
      <label className="flex flex-col gap-1 w-full">
        <p className="text-[1rem] leading-[1.375rem] text-richblack-25 font-medium">
          Course Category <sup className="text-pink-200">*</sup>
        </p>

        <div className="relative" ref={catRef}>
          {/* keep native select for form registration but hide it visually */}
          <select
            {...register("courseCategory", { required: true })}
            value={selectedCategoryId}
            onChange={(e) => {
              const id = e.target.value;
              const cat = courseCategories.find((c) => c._id === id);
              setSelectedCategoryId(id);
              setSelectedCategoryLabel(cat?.name || "");
              setValue("courseCategory", cat || id);
            }}
            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
          >
            <option value="" disabled>
              Choose a Category
            </option>
            {!loading &&
              courseCategories?.map((category) => (
                <option key={category?._id} value={category?._id}>
                  {category?.name}
                </option>
              ))}
          </select>

          {/* Visible custom control */}
          <button
            type="button"
            onClick={() => setCategoryOpen((p) => !p)}
            className="w-full bg-richblack-800 rounded-md p-3 border border-richblack-700 flex justify-between items-center text-richblack-5"
          >
            <span
              className={`${selectedCategoryLabel ? "" : "text-richblack-400"}`}
            >
              {selectedCategoryLabel || "Choose a Category"}
            </span>
            <span className="text-richblack-5 text-xl transform transition-transform">
              {categoryOpen ? "▴" : "▾"}
            </span>
          </button>

          {/* Options overlay */}
          {categoryOpen && (
            <div className="absolute left-0 mt-2 w-full bg-richblack-5 text-richblack-900 rounded-md shadow-lg z-50 max-h-52 overflow-auto custom-scrollbar border border-richblack-100">
              {loading ? (
                <div className="p-3 text-sm text-richblack-400">Loading...</div>
              ) : courseCategories && courseCategories.length > 0 ? (
                courseCategories.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => {
                      setSelectedCategoryId(c._id);
                      setSelectedCategoryLabel(c.name);
                      setValue("courseCategory", c);
                      setCategoryOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-richblack-50 cursor-pointer text-sm font-medium"
                  >
                    {c.name}
                  </div>
                ))
              ) : (
                <div className="p-3 text-sm text-richblack-400">
                  No categories available
                </div>
              )}
            </div>
          )}
        </div>

        {errors.courseCategory && (
          <span className="text-pink-300 text-xs">
            Course category is required
          </span>
        )}
      </label>

      {/* Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* Thumbnail */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits */}
      <label className="flex flex-col gap-1 w-full">
        <p className="text-[1rem] leading-[1.375rem] text-richblack-25 font-medium">
          Benefits of the Course <sup className="text-pink-200">*</sup>
        </p>

        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="bg-richblack-800 w-full rounded-md p-3 min-h-[130px] border border-richblack-700 placeholder-richblack-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-richblack-5"
        />

        {errors.courseBenefits && (
          <span className="text-pink-300 text-xs">
            Course benefits are required
          </span>
        )}
      </label>

      {/* Requirements */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements / Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      {/* Button Row */}
      <div className="flex justify-end gap-x-2 pt-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className="rounded-md bg-richblack-300 py-[8px] px-[20px] text-richblack-900 font-semibold"
          >
            Continue Without Saving
          </button>
        )}

        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
