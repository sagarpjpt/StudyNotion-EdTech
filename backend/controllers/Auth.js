const User = require("../models/User");
const Otp = require("../models/Otp");
const otpGenrator = require("otp-generator");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");

// send otp
exports.sendOtp = async (req, res) => {
  try {
    // fetching email from req
    const { email } = req.body;

    // check email already exist
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(401).json({
        success: false,
        message: "User Already Present!",
      });
    }

    // generate otp
    var otp = otpGenrator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated--> ", otp);

    // check unique otp
    let result = await Otp.findOne({ otp });
    while (result) {
      //very bad practice, so use package which always generate unique otp's
      otp = otpGenrator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await Otp.findOne({ otp });
    }

    const otpPayload = { email, otp };

    // create an entry for OTP
    const otpBody = await Otp.create(otpPayload);

    // return response successfull
    res.status(200).json({
      success: true,
      message: "OTP sent successfully !",
    });
  } catch (e) {
    console.log("error while sending otp", e);
    res.status(500).json({
      success: false,
      message: "Error while signing up",
    });
  }
};

// signup
exports.signUp = async (req, res) => {
  try {
    // data fetch from req
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    // validate kro
    if (!firstName || !lastName || !email || !password || !otp) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }

    // 2 password comparison
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password Do not match!",
      });
    }

    // check user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // find most recent otp stored for user
    const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 }); // get latest one

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP Not found",
      });
    }

    // compare entered otp with latest otp from DB
    if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }

    //  hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // entry create in db
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

    // return response successfull
    return res.status(200).json({
      success: true,
      message: "Registered Successfully!",
      user,
    });
  } catch (e) {
    console.log("error while signup", e);
    res.status(500).json({
      success: false,
      message: "Error while signing up",
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    // data fetch from req
    const { email, password } = req.body;

    // validate kro
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }

    // check user exist
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User is not registered",
      });
    }

    // password match
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // create jwt token
    const payload = {
      email: user.email,
      userId: user._id,
      role: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // create cookie and send response
    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 days
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      path: "/",
    };
    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "Logged In Successfully",
      user: payload,
    });
  } catch (e) {
    console.log("error while login", e);
    res.status(500).json({
      success: false,
      message: "Error while login",
    });
  }
};

// change password
exports.changePassword = async (req, res) => {
  try {
    // data fetch from req
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.userId;

    // validate kro
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }

    // find user from db
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // old password match
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old Password is incorrect",
      });
    }

    // new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password and Confirm New Password do not match",
      });
    }

    // hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    // save new password
    await user.save();

    // return response
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error while changing password",
    });
  }
};

// verify cookie
exports.meController = async (req, res) => {
  if(req.user) {
    const userData = await User.findById(req.user.userId)
    return res.json({success: true,
      user: {
        ...req.user,
        firstName: userData.firstName,
        lastName: userData.lastName
      }
    })
  }
  return res.status(401).json({success: false, message: "Not Authenticated"})
}

// logout
exports.logout = async (req, res) => {
  try{
    // clear token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      path: "/",
    })

    // return res
    return res.status(200).json({
      success: true,
      message: "Logged Out Successfully"
    })
  } catch(e) {
    console.log('error during logout:', e)
    return res.status(500).json({
      success: false,
      message: "Error while logging out"
    })
  }
}