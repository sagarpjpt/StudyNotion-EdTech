const mongoose = require("mongoose");

const COURSE_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
};

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    trim: true,
    required: true,
  },

  courseDescription: {
    type: String,
    trim: true,
    required: true,
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],

  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],

  price: {
    type: Number,
    required: true,
  },

  thumbnail: {
    type: String,
    required: true,
  },

  // FIX: convert tag to ARRAY
  tag: {
    type: [String],
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  whatYouWillLearn: {
    type: String,
    required: true,
  },

  instructions: {
    type: [String],
    required: true,
  },

  status: {
    type: String,
    enum: Object.values(COURSE_STATUS),
    default: COURSE_STATUS.DRAFT,
  },
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
