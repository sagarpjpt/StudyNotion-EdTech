import { RiEditBoxLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { profile } from "../../../services/apis";
import { apiConnector } from "../../../services/apiConnector";

import { formattedDate } from "../../../utils/dateFormatter";
import IconBtn from "../../common/IconBtn";

export default function MyProfile() {
  //   let { user } = useSelector((state) => state.profile)
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile picture
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await apiConnector("GET", profile.GET_USER_DETAILS);
        if (res?.data?.success) {
          setUser(res.data.userDetails);
          console.log("user from myProfile : ", user);
        }
      } catch (error) {
        console.error("Error fetching profile icon:", error);
      }
    };
    fetchUserDetails();
  }, []);

  return (
    // <>
    //   <h1 className="mb-14 text-3xl font-medium text-richblack-5">
    //     My Profile
    //   </h1>
    //   <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
    //     <div className="flex items-center gap-x-4">
    //       <img
    //         src={user?.image}
    //         alt={`profile-${user?.firstName}`}
    //         className="aspect-square w-[78px] rounded-full object-cover"
    //       />
    //       <div className="space-y-1">
    //         <p className="text-lg font-semibold text-richblack-5">
    //           {user?.firstName + " " + user?.lastName}
    //         </p>
    //         <p className="text-sm text-richblack-300">{user?.email}</p>
    //       </div>
    //     </div>
    //     <IconBtn
    //       text="Edit"
    //       onclick={() => {
    //         navigate("/dashboard/settings");
    //       }}
    //     >
    //       <RiEditBoxLine />
    //     </IconBtn>
    //   </div>
    //   <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
    //     <div className="flex w-full items-center justify-between">
    //       <p className="text-lg font-semibold text-richblack-5">About</p>
    //       <IconBtn
    //         text="Edit"
    //         onclick={() => {
    //           navigate("/dashboard/settings");
    //         }}
    //       >
    //         <RiEditBoxLine />
    //       </IconBtn>
    //     </div>
    //     <p
    //       className={`${
    //         user?.additionalDetails?.about
    //           ? "text-richblack-5"
    //           : "text-richblack-400"
    //       } text-sm font-medium`}
    //     >
    //       {user?.additionalDetails?.about ?? "Write Something About Yourself"}
    //     </p>
    //   </div>
    //   <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
    //     <div className="flex w-full items-center justify-between">
    //       <p className="text-lg font-semibold text-richblack-5">
    //         Personal Details
    //       </p>
    //       <IconBtn
    //         text="Edit"
    //         onclick={() => {
    //           navigate("/dashboard/settings");
    //         }}
    //       >
    //         <RiEditBoxLine />
    //       </IconBtn>
    //     </div>
    //     <div className="flex max-w-[500px] justify-between">
    //       <div className="flex flex-col gap-y-5">
    //         <div>
    //           <p className="mb-2 text-sm text-richblack-600">First Name</p>
    //           <p className="text-sm font-medium text-richblack-5">
    //             {user?.firstName}
    //           </p>
    //         </div>
    //         <div>
    //           <p className="mb-2 text-sm text-richblack-600">Email</p>
    //           <p className="text-sm font-medium text-richblack-5">
    //             {user?.email}
    //           </p>
    //         </div>
    //         <div>
    //           <p className="mb-2 text-sm text-richblack-600">Gender</p>
    //           <p className="text-sm font-medium text-richblack-5">
    //             {user?.additionalDetails?.gender ?? "Add Gender"}
    //           </p>
    //         </div>
    //       </div>
    //       <div className="flex flex-col gap-y-5">
    //         <div>
    //           <p className="mb-2 text-sm text-richblack-600">Last Name</p>
    //           <p className="text-sm font-medium text-richblack-5">
    //             {user?.lastName}
    //           </p>
    //         </div>
    //         <div>
    //           <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
    //           <p className="text-sm font-medium text-richblack-5">
    //             {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
    //           </p>
    //         </div>
    //         <div>
    //           <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
    //           <p className="text-sm font-medium text-richblack-5">
    //               {
    //                 user?.additionalDetails?.dateOfBirth ? formattedDate(user?.additionalDetails?.dateOfBirth) : "Add Date Of Birth"
    //               }
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </>
    <>
  <h1 className="mb-8 text-2xl sm:mb-14 sm:text-3xl font-medium text-richblack-5">
    My Profile
  </h1>

  {/* Profile header: avatar + name + edit */}
  <div className="flex flex-col gap-4 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-8">
    <div className="flex items-center gap-4">
      <img
        src={user?.image}
        alt={`profile-${user?.firstName}`}
        className="aspect-square w-20 rounded-full object-cover sm:w-[78px]"
      />
      <div className="space-y-0.5">
        <p className="text-lg font-semibold text-richblack-5">
          {user?.firstName + " " + user?.lastName}
        </p>
        <p className="text-sm text-richblack-300 break-all">{user?.email}</p>
      </div>
    </div>

    <div className="mt-2 sm:mt-0 flex justify-end">
      <IconBtn
        text="Edit"
        onclick={() => {
          navigate("/dashboard/settings");
        }}
        customClasses="!py-2 !px-3 !text-sm"
        aria-label="Edit profile"
      >
        <RiEditBoxLine />
      </IconBtn>
    </div>
  </div>

  {/* About */}
  <div className="my-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 sm:my-10 sm:px-12 sm:py-8">
    <div className="flex gap-4 flex-row items-center justify-between">
      <p className="text-lg font-semibold text-richblack-5">About</p>

      <div className="flex items-center sm:ml-6">
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings");
          }}
          customClasses="!py-2 !px-3 !text-sm"
          aria-label="Edit about"
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>
    </div>

    <p
      className={`mt-4 text-sm font-medium ${
        user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"
      }`}
    >
      {user?.additionalDetails?.about ?? "Write Something About Yourself"}
    </p>
  </div>

  {/* Personal Details */}
  <div className="my-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 sm:my-10 sm:px-12 sm:py-8">
    <div className="flex gap-4 flex-row items-center justify-between">
      <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
      <div className="flex items-center sm:ml-6">
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings");
          }}
          customClasses="!py-2 !px-3 !text-sm"
          aria-label="Edit personal details"
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>
    </div>

    {/* Two-column grid on md+, single column on small */}
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-[600px]">
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-sm text-richblack-600">First Name</p>
          <p className="text-sm font-medium text-richblack-5">{user?.firstName}</p>
        </div>

        <div>
          <p className="mb-2 text-sm text-richblack-600">Last Name</p>
          <p className="text-sm font-medium text-richblack-5">{user?.lastName}</p>
        </div>

        <div>
          <p className="mb-2 text-sm text-richblack-600">Email</p>
          <p className="text-sm font-medium text-richblack-5 break-all">{user?.email}</p>
        </div>

        <div>
          <p className="mb-2 text-sm text-richblack-600">Gender</p>
          <p className="text-sm font-medium text-richblack-5">
            {user?.additionalDetails?.gender ?? "Add Gender"}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
          <p className="text-sm font-medium text-richblack-5">
            {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
          <p className="text-sm font-medium text-richblack-5">
            {user?.additionalDetails?.dateOfBirth
              ? formattedDate(user?.additionalDetails?.dateOfBirth)
              : "Add Date Of Birth"}
          </p>
        </div>
      </div>
    </div>
  </div>
</>

  );
}
