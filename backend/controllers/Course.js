const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create course
exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      instructions,
      status
    } = req.body;

    const thumbnail = req.files.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail ||
      !tag ||
      !instructions
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const tagsArray = JSON.parse(tag); // ["c++","stl"]
    const instructionsArray = JSON.parse(instructions); // ["req1","req2"]

    // check instructor
    const userId = req.user.userId;
    const instructor = await User.findById(userId);
    if (instructor.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can create courses",
      });
    }

    // category validation
    const categoryExists = await Tag.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // upload image
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.COURSE_THUMBNAIL_FOLDER
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: tagsArray,
      category,
      thumbnail: thumbnailImage.url,
      status: status || "DRAFT",
      instructions: instructionsArray,
      instructor: instructor._id,
    });

    // Add course to instructor
    await User.findByIdAndUpdate(
      instructor._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Add course to category
    await Tag.findByIdAndUpdate(
      categoryExists._id,
      { $push: { course: newCourse._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// edit course
exports.editCourse = async (req, res) => {
  try {
    const {
      courseId,
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      instructions,
      status
    } = req.body;

    // validation: courseId must exist
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // instructor validation
    const userId = req.user.userId;
    if (String(existingCourse.instructor) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this course",
      });
    }

    // BUILD UPDATE OBJECT
    const updateFields = {};

    if (courseName) updateFields.courseName = courseName;
    if (courseDescription) updateFields.courseDescription = courseDescription;
    if (whatYouWillLearn) updateFields.whatYouWillLearn = whatYouWillLearn;
    if (price) updateFields.price = price;

    // tag JSON → array
    if (tag) {
      try {
        updateFields.tag = JSON.parse(tag); // ["c++","ds"]
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid tag format",
        });
      }
    }

    // instructions JSON → array
    if (instructions) {
      try {
        updateFields.instructions = JSON.parse(instructions); // ["req1","req2"]
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid instructions format",
        });
      }
    }

    // category updated?
    let oldCategory = existingCourse.category;
    let newCategory = category;

    if (category) {
      const categoryExists = await Tag.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      updateFields.category = category;
    }

    if (status) updateFields.status = status;

    // THUMBNAIL UPDATE (OPTIONAL)
    const thumbnail = req.files?.thumbnailImage;
    if (thumbnail) {
      const uploadedThumbnail = await uploadImageToCloudinary(
        thumbnail,
        process.env.COURSE_THUMBNAIL_FOLDER
      );
      updateFields.thumbnail = uploadedThumbnail.url;
    }

    // UPDATE COURSE
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: updateFields },
      { new: true }
    );

    // HANDLE CATEGORY CHANGE (reverse mapping)
    if (category && String(oldCategory) !== String(newCategory)) {
      // Remove from old category
      await Tag.findByIdAndUpdate(oldCategory, {
        $pull: { course: updatedCourse._id },
      });

      // Add to new category
      await Tag.findByIdAndUpdate(newCategory, {
        $push: { course: updatedCourse._id },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });

  } catch (error) {
    console.log("Error in editCourse:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all courses
exports.getAllCourses = async (req, res) => {
  try {
    // fetch all courses from db
    const courses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
        instructor: true,
      }
    )
      .populate("instructor")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "All Courses fetched successfully",
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get course details by id
exports.getCourseDetails = async (req, res) => {
  try {
    // fetch courseId from params
    const { courseId } = req.params;

    // validate courseId
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // populate everything in course schema
    const fullCourseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .populate("category")
      .populate({
        path: "ratingAndReviews",
        populate: { path: "user", select: "firstName lastName" }, 
      })
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      course: fullCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

// get all courses of instructor
exports.getAllCoursesOfInstructor = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware

    // Find the instructor and populate their courses deeply
    const instructor = await User.findById(userId)
      .populate({
        path: "courses",
        populate:
          {
            path: "courseContent", // array of sections
            populate: {
              path: "subSection", // array of subsections
            },
          }
      })
      .exec();

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses: instructor.courses, // return only array of courses
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// delete a course of instructor
exports.deleteCourse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Fetch course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Ensure only instructor who created the course can delete it
    if (course.instructor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    // 1️⃣ Remove course from instructor's courses array
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { courses: courseId },
    });

    // 2️⃣ Remove course from category
    await Tag.findByIdAndUpdate(course.category, {
      $pull: { courses: courseId },
    });

    // 3️⃣ Remove course from students enrolled
    await User.updateMany(
      { _id: { $in: course.studentsEnrolled } },
      { $pull: { courseProgress: courseId } }
    );

    // 4️⃣ Delete all sections + their subsections
    const sections = await Section.find({ _id: { $in: course.courseContent } });

    for (const section of sections) {
      await SubSection.deleteMany({ _id: { $in: section.subSection } });
    }

    await Section.deleteMany({ _id: { $in: course.courseContent } });

    // 5️⃣ Finally delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};

// get student enrolled courses
exports.getStudentEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user & enrolled courses with deep population
    const student = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: { path: "subSection" }
        }
      })
      .exec();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // If user has no courses
    const enrolledCourses = student.courses || [];

    // FINAL RESULT ARRAY
    const coursesWithProgress = [];

    for (const course of enrolledCourses) {
      // 1) Total number of lectures in this course
      const totalLectures = course.courseContent?.reduce(
        (acc, section) => acc + (section.subSection?.length || 0),
        0
      );

      // 2) Fetch this student's progress document for this course
      const progress = await CourseProgress.findOne({
        userId,
        courseId: course._id
      });

      // 3) Completed lecture count
      const completedLectures = progress?.completedVideos?.length || 0;

      // 4) Percentage
      const progressPercentage =
        totalLectures === 0
          ? 0
          : Math.floor((completedLectures / totalLectures) * 100);

      // 5) Attach progress to course object
      coursesWithProgress.push({
        ...course.toObject(),
        totalLectures,
        completedLectures,
        progressPercentage,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      courses: coursesWithProgress,
    });

  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

// update course progress
exports.getCourseProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const progress = await CourseProgress.findOne({ userId, courseId });

    res.json({
      success: true,
      completedVideos: progress?.completedVideos || [],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
