const express = require('express');
const router = express.Router();

// import controllers fn
const {createCategory, getAllCategory, categoryPageDetails} = require('../controllers/Category');
const { auth, isAdmin, isInstructor, isStudent } = require('../middlewares/auth');
const { createCourse, editCourse, deleteCourse, getAllCourses, getCourseDetails, getAllCoursesOfInstructor, getStudentEnrolledCourses, getCourseProgress } = require('../controllers/Course');
const { createSection, updateSection, deleteSection } = require('../controllers/Section');
const {createSubSection, deleteSubSection, updateSubSection, markLectureCompleted} = require('../controllers/SubSection');
const { createRatingAndReview, getAverageRating, getAllRatingsAndReviews, getAllRatingsAndReviewsByCourseId } = require('../controllers/RatingAndReview');

// route to create category
router.post('/create-category', auth, isAdmin, createCategory);

// route to get all categories
router.get('/get-all-categories', getAllCategory);

// route to get category page details
router.get('/category-page-details/:categoryId',categoryPageDetails);

// router to create course
router.post('/create-course', auth, isInstructor, createCourse);

// router to edit course
router.put('/edit-course', auth, isInstructor, editCourse)

// router to delete course
router.delete('/delete-course', auth, isInstructor, deleteCourse)

// router to get course details
router.get('/course/:courseId', getCourseDetails);

// router to get all courses
router.get('/get-all-courses', auth, getAllCourses);

// router to get all courses of an instructor
router.get('/instructor-courses-details', auth, isInstructor, getAllCoursesOfInstructor)

// router to get all enrolled courses of an student
router.get('/student-enrolled-courses', auth, isStudent, getStudentEnrolledCourses)

// router to get course progress
router.get('/course-progress/:courseId', auth, isStudent, getCourseProgress)

// router to add section to course
router.post('/add-section', auth, isInstructor, createSection);

// router to update section
router.put('/update-section', auth, isInstructor, updateSection);

// router to delete section
router.delete('/delete-section', auth, isInstructor, deleteSection);

// router to create subsection
router.post('/add-subsection', auth, isInstructor, createSubSection);

// router to update subsection
router.put('/update-subsection', auth, isInstructor, updateSubSection);

// router to delete subsection
router.delete('/delete-subsection', auth, isInstructor, deleteSubSection);

// router to mark subsection/lecture as completed
router.post('/mark-completed', auth, isStudent, markLectureCompleted)

// router to create rating and review
router.post('/create-rating-review', auth, isStudent, createRatingAndReview);

// router to get average rating of a course
router.get('/average-rating/:courseId', getAverageRating);

// router to get all ratings and reviews
router.get('/all-ratings-reviews', getAllRatingsAndReviews);

// router to get all ratings and reviews by courseId
router.get('/all-ratings-reviews/:courseId', getAllRatingsAndReviewsByCourseId);

module.exports = router;