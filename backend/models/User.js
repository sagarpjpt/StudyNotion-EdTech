const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },

    // password optional for google users
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },

    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },

    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    image: {
      type: String,
      default: "",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    token: String,
    resetPasswordExpires: Date,

    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

// we dont store courseProgress ids here as not needed now
// will store when we require:
//Show all user’s course progress at once like for--> Analytics dashboards
