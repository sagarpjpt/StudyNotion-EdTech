const Tag = require("../models/Category");
const Course = require("../models/Course");

// create category
exports.createCategory = async (req, res) => {
  try {
    // fetch data from req
    const { name, description } = req.body;

    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and Description are required",
      });
    }

    // create cateogry entry in db
    const category = await Tag.create({ name, description });

    // return response
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error" + error.message,
    });
  }
};

// get all category
exports.getAllCategory = async (req, res) => {
  try {
    // fetch all tags from db
    const categories = await Tag.find();

    // return response
    return res.status(200).json({
      success: true,
      message: "All Category fetched successfully",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    // fetch categoryId from url params
    const { categoryId } = req.params;

    // get course details based on categoryId
    const categoryDetails = await Tag.findById(categoryId)
      .populate({
        path: "course",
        match: { status: "Published"}, // only fetch published courses
        populate: {
          path: "instructor",
          model: "User", // replace if your instructor model name is different
        },
      })
      .exec();

    // validate categoryDetails
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // get courses for different categories
    const differentCategory = await Tag.find({ _id: { $ne: categoryId } }) // fetch all categories except current category
      .populate({
        path: "course",
        match: { status: "Published"}, // only fetch published courses
        populate: {
          path: "instructor",
          model: "User", // replace if your instructor model name is different
        },
      })
      .exec();

    // get top selling courses
    const courses = await Course.find({ status: "Published" }) // only fetch published courses
      .sort({ studentsEnrolled: -1 }) // sort by number of students enrolled in descending order
      .limit(10) // limit to top 10 courses
      .populate("instructor")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Category Page Details fetched successfully",
      data: {
        categoryDetails,
        differentCategory,
        topSellingCourses: courses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};
