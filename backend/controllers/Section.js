const Section = require("../models/Section");
const Course = require("../models/Course");

// create section
exports.createSection = async (req, res) => {
  try {
    // fetch data from req
    const { courseId, sectionName } = req.body;

    // validation
    if (!courseId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Section Name are required",
      });
    }

    // create section
    const newSection = await Section.create({ sectionName});

    // add section to course
    const courseDetails = await Course.findByIdAndUpdate(courseId, 
        { $push: { courseContent: newSection._id }, }, 
        { new: true }).populate({
        path: "courseContent",
        populate: {
          path: "subSection", // populate the subsections inside each section
        },
      });

    // return response
    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      courseDetails,
    });
  } catch (error) {
    console.error("Error in createSection:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

// update section
exports.updateSection = async (req, res) => {
  try {
    // fetch data from req
    const { sectionId, sectionName } = req.body;

    // validation
    if (!sectionId || !sectionName) {
        return res.status(400).json({
        success: false,
        message: "Section ID and Section Name are required",
      });
    }

    // update section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
        message: "Section updated successfully",
        updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
        message: "Internal Server Error: " + error.message,
    });
  }
};

// delete section
exports.deleteSection = async (req, res) => {
  try {
    // fetch data from req
    const { sectionId } = req.body;

    // validation
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section ID is required",
      });
    }

    // delete section
    await Section.findByIdAndDelete(sectionId);

    // also remove the section from any course that contains it
    await Course.updateMany(
      { courseContent: sectionId },
      { $pull: { courseContent: sectionId } }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
        message: "Internal Server Error: " + error.message,
    });
  }
};