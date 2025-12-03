import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { auth } from "../../../services/apis"
import { apiConnector } from "../../../services/apiConnector"
import ConfirmationModal from "../../common/ConfirmationModal"
import SidebarLink from "./SidebarLink"
import toast from "react-hot-toast"
import { logout } from "../../../redux/slices/profileSlice"; // adjust path if needed


export default function Sidebar() {
  const { user } = useSelector(
    (state) => state.profile
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)

  async function logoutUser() {
    try {
      const res = await apiConnector("POST", auth.LOG_OUT);
      if (res?.data?.success) {
        toast.success("Logged out successfully");
        // clear redux state
        dispatch(logout());
        // remove any local data
        localStorage.removeItem("verifyEmailPending");
        localStorage.removeItem("verifyEmailFor");
        localStorage.removeItem("signupPayload");

        localStorage.setItem("logoutEvent", "true");
        navigate("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout");
    }
  }

  return (
    <>
      <div className="hidden md:flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r border-r-richblack-700 bg-richblack-800 py-10 md:sticky md:top-0">
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.role !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            )
          })}
        </div>
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: logoutUser,
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="text-richblack-300 ml-8 text-md mt-2 cursor-pointer transform hover:scale-110 transition-transform duration-200"
          >
            <div className="flex gap-x-2 items-center">
              <VscSignOut className="text-lg" />
              <span className="text-[15px]">Logout</span>
            </div>
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
