const otpGenerator = require("otp-generator");
const Otp = require("../models/Otp");
const Profile = require("../models/Profile");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");

// SEND PHONE OTP
exports.sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    // const userId = req.user.userId;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // check if phone number is valid - todo

    // check if phone already verified by someone else (optional but good)
    const existingProfile = await Profile.findOne({
      contactNumber: phone,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Phone number already in use",
      });
    }

    // generate numeric otp
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // store otp
    await Otp.create({
      phone,
      otp,
      type: "phone",
    });

    // TODO: integrate sms provider here (MSG91 / Twilio)
    // for now just console log for learning and sending to email as well
    await mailSender(
      req.user.email,
      "Mobile Number Verification OTP",
      `
    <div>
      <h1>StudyNotion Mobile Number Verification</h1>
      <p>Your OTP for mobile number verification is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for a limited time.</p>
    </div>
  `
    );

    console.log("PHONE OTP -->", otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to mobile number",
    });
  } catch (error) {
    console.log("error while sending phone otp", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// VERIFY PHONE OTP
exports.verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const userId = req.user.userId;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    // get latest otp for phone
    const recentOtp = await Otp.findOne({
      phone,
      type: "phone",
    }).sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // otp verified → update profile
    const user = await User.findById(userId).populate("additionalDetails");

    if (!user || !user.additionalDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const profile = user.additionalDetails;

    profile.contactNumber = phone;
    profile.isPhoneVerified = true;
    profile.phoneVerifiedAt = new Date();

    await profile.save();

    // cleanup used otp
    await Otp.deleteMany({ phone, type: "phone" });

    return res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (error) {
    console.log("error while verifying phone otp", error);
    return res.status(500).json({
      success: false,
      message: "Phone verification failed",
    });
  }
};
