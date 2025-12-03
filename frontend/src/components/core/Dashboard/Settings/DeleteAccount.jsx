import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../../../../redux/slices/profileSlice";
import { apiConnector } from "../../../../services/apiConnector";
import { profile } from "../../../../services/apis";
import { useState } from "react";
import Spinner from "../../../common/Spinner";

export default function DeleteAccount() {
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleDeleteAccount() {
    setLoading(true);
    try {
      const res = await apiConnector("DELETE", profile.DEL_PROF);
      if (res?.data?.success) {
        toast.success("Account Deleted Sucessfully");
        dispatch(logout());
        navigate("/");
      } else {
        toast.error(res?.data?.message || "something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <>
      <div className="my-10 flex flex-col lg:flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-6 lg:p-8 lg:px-12">

        <div className="flex lg:block gap-20">
          <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
            <FiTrash2 className="text-3xl text-pink-200" />
          </div>
        </div>

        <div className="flex flex-col space-y-2 mt-4">
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Account
          </h2>

          <div className="lg:w-3/5 text-pink-25">
            <p>Would you like to delete account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the contain associated with it.
            </p>
          </div>

          <button
            type="button"
            className="w-fit cursor-pointer italic text-pink-300 hover:text-richblack-5 hover:underline transition-all duration-200"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            I want to delete my account.
          </button>
        </div>
      </div>

      {/* delete modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-richblack-800 border border-pink-700 rounded-md w-[90%] sm:w-[420px] p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-richblack-5">
              Confirm Account Deletion
            </h2>

            <p className="mt-3 text-pink-200 text-sm">
              Are you absolutely sure you want to delete your account? You will
              permanently lose:
            </p>

            <ul className="list-disc list-inside text-pink-100 text-sm mt-2 space-y-1">
              <li>Your purchased courses</li>
              <li>Your progress and certificates</li>
              <li>Your saved data</li>
            </ul>

            <p className="mt-4 text-pink-300 text-sm italic">
              This action is irreversible.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md bg-richblack-700 text-richblack-200 hover:bg-richblack-600 transition-all"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded-md bg-pink-700 text-pink-25 hover:bg-pink-600 transition-all"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  handleDeleteAccount(); // your function triggered here
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
