import RenderSteps from "./RenderSteps"

export default function AddCourse() {
  return (
  <>
    <div className="flex w-full items-start gap-x-6">
      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-semibold text-richblack-5">
          Add Course
        </h1>

        <div className="flex-1">
          <RenderSteps />
        </div>
      </div>

      {/* Course Upload Tips */}
      <div className="
        sticky top-10 hidden xl:block
        max-w-[380px] flex-1
        rounded-lg border border-richblack-700 
        bg-richblack-800/70 backdrop-blur-sm
        p-6 shadow-[0_0_25px_rgba(255,255,255,0.05)]
        transition-all duration-300
        hover:border-yellow-500/40 hover:shadow-[0_0_35px_rgba(255,255,255,0.08)]
      ">
        
        <p className="mb-5 text-xl font-semibold text-yellow-50 tracking-wide">
          ⚡ Course Upload Tips
        </p>

        <ul className="ml-4 list-disc space-y-4 text-sm leading-relaxed text-richblack-200">
          <li className="hover:text-richblack-5 transition-all duration-300">
            Set the course price option or make it free.
          </li>
          <li className="hover:text-richblack-5 transition-all duration-300">
            Recommended thumbnail size: <span className="text-yellow-50">1024 × 576</span>.
          </li>
          <li className="hover:text-richblack-5 transition-all duration-300">
            Video section controls the course overview video.
          </li>
          <li className="hover:text-richblack-5 transition-all duration-300">
            Course Builder is where you create & organize the course.
          </li>
          <li className="hover:text-richblack-5 transition-all duration-300">
            Add Topics to create lessons, quizzes, and assignments.
          </li>
          <li className="hover:text-richblack-5 transition-all duration-300">
            Additional Data appears on the course details page.
          </li>
          <li className="hover:text-richblack-5 transition-all duration-300">
            Make announcements to inform students of updates.
          </li>
          <li className="hover:text-richblack-5 transition-all duration-300">
            Notes allow sharing important points with students.
          </li>
        </ul>
      </div>
    </div>
  </>
)

}