const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadVideoToCloudinary } = require("../utils/videoUploader");
require("dotenv").config();
const CourseProgress = require("../models/CourseProgress");

// create subsection

exports.createSubSection = async (req, res) => {
  try {
    // fetch data from req
    const { sectionId, title, timeDuration, description } = req.body;

    // fetch video file from req
    const videoFile = req.files.videoFile;

    console.log("Req Body:", req.body);
    console.log("Video File:", videoFile);

    // validation
    if (!sectionId || !title || !timeDuration || !description || !videoFile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary
    const uploadedVideo = await uploadVideoToCloudinary(
      videoFile,
      process.env.COURSE_VIDEO_FOLDER
    );

    // create subsection
    const newSubSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadedVideo.url,
    });

    // update section with new subsection
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: newSubSection._id } },
      { new: true }
    ).populate("subSection");

    // return response
    return res.status(201).json({
      success: true,
      message: "SubSection created successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

// delete subsection
exports.deleteSubSection = async (req, res) => {
  try {
    // fetch data from req
    const { subSectionId, sectionId } = req.body;

    // validation
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID and Section ID are required",
      });
    }

    // delete subsection
    await SubSection.findByIdAndDelete(subSectionId);

    // update section to remove deleted subsection
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true }
    ).populate("subSection");

    // return response
    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

// update subsection
exports.updateSubSection = async (req, res) => {
  try {
    // fetch data from req
    const { subSectionId, title, timeDuration, description } = req.body;

    // ✅ safely get video file (avoid crash when not provided)
    const videoFile = req.files ? req.files.videoFile : null;

    // validation
    if (!subSectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary if new video file is provided
    let videoUrl = null;
    if (videoFile) {
      const uploadedVideo = await uploadImageToCloudinary(
        videoFile,
        process.env.COURSE_VIDEO_FOLDER
      );
      videoUrl = uploadedVideo.url;
    }

    // update subsection
    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      { title, timeDuration, description, ...(videoUrl && { videoUrl }) },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      updatedSubSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

// mark lec completed
exports.markLectureCompleted = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const userId = req.user.userId;

    let progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = await CourseProgress.create({
        userId,
        courseId,
        completedVideos: [lectureId],
      });
      return res.json({ success: true, message: "Lecture marked completed" });
    }

    if (!progress.completedVideos.includes(lectureId)) {
      progress.completedVideos.push(lectureId);
      await progress.save();
    }

    return res.json({
      success: true,
      message: "Lecture marked completed",
      completedVideos: progress.completedVideos,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
