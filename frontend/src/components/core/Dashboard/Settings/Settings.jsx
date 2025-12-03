import { useState } from "react";
import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";
import { useEffect } from "react";
import { apiConnector } from "../../../../services/apiConnector";
import { profile } from "../../../../services/apis";

export default function Settings() {

  const [user, setUser] = useState(null)

  // Fetch user profile picture
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const res = await apiConnector("GET", profile.GET_USER_DETAILS);
          if (res?.data?.success) {
            setUser(res.data.userDetails);
          }
        } catch (error) {
          console.error("Error fetching profile icon:", error);
        }
      };
      fetchUserDetails();
    }, [user]);

  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Profile
      </h1>
      <div className="text-richblack-5">
        {/* Change Profile Picture */}
        <ChangeProfilePicture user={user} setUser={setUser} />
        {/* Profile */}
        <EditProfile user={user} setUser={setUser} />
        {/* Password */}
        <UpdatePassword user={user} setUser={setUser} />
        {/* Delete Account */}
        <DeleteAccount user={user} setUser={setUser} />
      </div>
    </>
  );
}
