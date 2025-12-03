import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"

import { apiConnector } from "../../../../../services/apiConnector"
import { course_sections } from "../../../../../services/apis"
import { setCourse } from "../../../../../redux/slices/courseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course) || { courseContent: [] }
  const dispatch = useDispatch()

  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  // delete whole section
  const handleDeleleSection = async (sectionId) => {
    try {
      const res = await apiConnector("DELETE", course_sections.DELETE_SECTION, { sectionId })
      if (res?.data?.success) {
        toast.success(res.data.message || "Section deleted")
        // remove section locally from redux (controller does not return course)
        const updatedCourseContent = (course.courseContent || []).filter(
          (s) => String(s._id) !== String(sectionId)
        )
        const updatedCourse = { ...course, courseContent: updatedCourseContent }
        dispatch(setCourse(updatedCourse))
      } else {
        toast.error(res?.data?.message || "Failed to delete section")
      }
    } catch (err) {
      console.error("delete section error", err)
      toast.error(err?.response?.data?.message || "Error deleting section")
    } finally {
      setConfirmationModal(null)
    }
  }

  // delete a subsection
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    try {
      const res = await apiConnector("DELETE", course_sections.DELETE_SUB_SECTION, {
        subSectionId,
        sectionId,
      })

      if (res?.data?.success) {
        toast.success(res.data.message || "Subsection deleted")
        const updatedSection = res.data.updatedSection
        // Replace the section in courseContent with updatedSection
        const updatedCourseContent = (course.courseContent || []).map((section) =>
          String(section._id) === String(sectionId) ? updatedSection : section
        )
        const updatedCourse = { ...course, courseContent: updatedCourseContent }
        dispatch(setCourse(updatedCourse))
      } else {
        toast.error(res?.data?.message || "Failed to delete subsection")
      }
    } catch (err) {
      console.error("delete subsection error", err)
      toast.error(err?.response?.data?.message || "Error deleting subsection")
    } finally {
      setConfirmationModal(null)
    }
  }

  return (
    <>
      <div className="rounded-lg bg-richblack-700 p-6 px-8" id="nestedViewContainer">
        {(course?.courseContent || []).map((section) => (
          <details key={section._id} open>
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-richblack-50" />
                <p className="font-semibold text-richblack-50">{section.sectionName}</p>
              </div>

              <div className="flex items-center gap-x-3">
                <button
                  onClick={() =>
                    handleChangeEditSectionName(section._id, section.sectionName)
                  }
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>

                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleleSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>

                <span className="font-medium text-richblack-300">|</span>
                <AiFillCaretDown className={`text-xl text-richblack-300`} />
              </div>
            </summary>

            <div className="px-6 pb-4">
              {/* Render subsections */}
              {(section.subSection || []).map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2 ">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">{data.title}</p>
                  </div>

                  <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-x-3">
                    <button
                      onClick={() => setEditSubSection({ ...data, sectionId: section._id })}
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>

                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Sub-Section?",
                          text2: "This lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setAddSubsection(section._id)}
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
              >
                <FaPlus className="text-lg" />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>

      {/* Modals */}
      {addSubSection ? (
        <SubSectionModal modalData={addSubSection} setModalData={setAddSubsection} add={true} />
      ) : viewSubSection ? (
        <SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true} />
      ) : editSubSection ? (
        <SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} />
      ) : (
        <></>
      )}

      {confirmationModal ? <ConfirmationModal modalData={confirmationModal} /> : <></>}
    </>
  )
}
