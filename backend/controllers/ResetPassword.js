const User = require("../models/User");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { resetPasswordTemplate } = require("../mail/templates/resetPassword");

// resetPassword Token
exports.resetPasswordToken = async (req, res) => {
  try {
    // data fetch from req
    const { email } = req.body;

    // check user is present
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // generate token
    const resetToken = crypto.randomUUID();

    // update user doc in db by adding token and expiry time 1 hr
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        token: resetToken,
        resetPasswordExpires: Date.now() + 3600000, // 1 hr from now
      },
      { new: true }
    );

    // create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&userId=${user._id}`;

    // send url via email
    await mailSender(
      user.email,
      "Password Reset Request",
      resetPasswordTemplate(resetUrl)
    );

    // return res
    return res.status(200).json({
      success: true,
      message: "Reset Password link has been sent to your email",
    });
  } catch (error) {
    console.error("Error in resetPasswordToken:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// reset Password
exports.resetPassword = async (req, res) => {
  try {
    // data fetch from req
    const { token, userId, newPassword, confirmNewPassword } = req.body;

    // check user is present
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // validate token and expiry time
    // console.log("User Token:", user.token);
    // console.log("Provided Token:", token);
    // console.log("Token Expiry Time:", user.resetPasswordExpires);
    // console.log("Current Time:", Date.now());
    if (user.token !== token || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // validate new password and confirm new password
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password and Confirm New Password do not match",
      });
    }

    // hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    // remove token and expiry time
    user.token = undefined;
    user.resetPasswordExpires = undefined;

    // save user
    await user.save();

    // return res
    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
