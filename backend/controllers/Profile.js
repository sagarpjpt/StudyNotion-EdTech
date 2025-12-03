const User = require("../models/User");
const Profile = require("../models/Profile");
const Course = require("../models/Course");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const dotenv = require("dotenv");

// update profile
exports.updateProfile = async (req, res) => {
  try {
    // fetch data from req
    const { firstName, lastName, gender, dateOfBirth="", about="", contactNumber } = req.body;

    // user id from auth middleware
    const userId = req.user.userId;

    // validation
    if (!userId || !gender || !contactNumber || !about) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    // find profile id from user
    let user = await User.findById(userId);
    const profileId = user.additionalDetails;

    // update first name and lastname if provided
    if(firstName) {
      await User.findByIdAndUpdate(
        user,
        {firstName}
      )
    }
    if(lastName) {
      await User.findByIdAndUpdate(
        user,
        {lastName}
      )
    }

    // update profile
    const updatedProfile = await Profile.findByIdAndUpdate(
        profileId,
        { gender, dateOfBirth, about, contactNumber },
        { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedProfile,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      success: false,
        message: "Internal Server Error: " + error.message,
    });
  }
};

// deleteAccount
exports.deleteAccount = async (req, res) => {
  try {
    // fetch user id from auth middleware
    const userId = req.user.userId;

    // validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // clear token cookie
    res.clearCookie("token", {
      httpOnly: true
    })

    // delete profile
    const user = await User.findById(userId);
    const profileId = user.additionalDetails;
    await Profile.findByIdAndDelete(profileId);

    // unlink user(student) from enrolled courses 
    const courses = user.enrolledCourses;
    if(courses && courses.length > 0){
      for (let courseId of courses) {
        await Course.findByIdAndUpdate(courseId, {
          $pull: { studentsEnrolled: userId },
        });
      }
    }

    // delete user
    await User.findByIdAndDelete(userId);

    // return response
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
        message: "Internal Server Error: " + error.message,
    });
  }
};

// get all user details
exports.getUserDetails = async (req, res) => {
  try {
    // fetch user id from auth middleware
    const userId = req.user.userId;

    // fetch user details from db
    const userDetails = await User.findById(userId).populate("additionalDetails").exec();
    userDetails.password = undefined; // hide password field

    // return response
    return res.status(200).json({
      success: true,
        message: "User details fetched successfully",
        userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
        message: "Internal Server Error: " + error.message,
    });
  }
};

exports.updateDP = async (req, res) => {
  try {
    // fetch user id from req
    const userId = req.user.userId

    // fetch file from req
    const img = req.files.displayPicture;

    // validation
    if(!userId || !img){
      return res.status(400).json({
        success: false,
        message: "User ID and img are required"
      });
    }

    // fetch user from db
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // upload img to cloudinary
    const result = await uploadImageToCloudinary(img, process.env.DISPLAY_PICTURE_FOLDER
    );

    // update user img url in db
    user.image = result.url;
    await user.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "Display picture updated successfully",
      imageUrl: user.image,
    });
  } catch (error) {
    console.error("Error in updateDP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

exports.getInstructorDashboardData = async (req, res) => {
  try {
    const instructorId = req.user.userId;

    // Find all courses created by this instructor
    const courses = await Course.find({ instructor: instructorId })
      .populate("studentsEnrolled")
      .exec();

    // Prepare structured dashboard data
    const dashboardData = courses.map(course => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      return {
        courseId: course._id,
        courseName: course.courseName,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
    });

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });

  } catch (error) {
    console.error("Error in getInstructorDashboardData:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};