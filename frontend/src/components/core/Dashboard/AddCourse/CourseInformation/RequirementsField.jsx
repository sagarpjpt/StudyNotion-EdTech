import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course);
  const [requirement, setRequirement] = useState("");
  const [requirementsList, setRequirementsList] = useState([]);

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions);
    }
    register(name, { required: true, validate: (value) => value.length > 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(name, requirementsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementsList]);

  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementsList([...requirementsList, requirement]);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...requirementsList];
    updatedRequirements.splice(index, 1);
    setRequirementsList(updatedRequirements);
  };

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm text-richblack-25 font-medium" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full bg-richblack-800 text-richblack-5 placeholder-richblack-400 rounded-md p-3 border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
        />

        <button
          type="button"
          onClick={handleAddRequirement}
          className="mt-2 sm:mt-0 inline-flex items-center justify-center gap-2 bg-yellow-50 text-richblack-900 font-semibold px-4 py-2 rounded-md hover:brightness-95 transition"
          aria-label="Add requirement"
        >
          Add
        </button>
      </div>

      {requirementsList.length > 0 && (
        <ul className="mt-3 space-y-2">
          {requirementsList.map((requirement, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-richblack-800 border border-richblack-700 rounded-md px-3 py-2 text-richblack-5"
            >
              <span className="truncate mr-4">{requirement}</span>
              <button
                type="button"
                className="ml-2 text-xs text-pink-200 hover:text-pink-300"
                onClick={() => handleRemoveRequirement(index)}
                aria-label={`Remove requirement ${index + 1}`}
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-300">
          {label} is required
        </span>
      )}
    </div>
  );
}
