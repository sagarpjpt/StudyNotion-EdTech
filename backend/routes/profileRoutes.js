const express = require('express');
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/auth");

// import controllers fn
const { updateProfile, deleteAccount, getUserDetails, updateDP, getInstructorDashboardData } = require("../controllers/Profile");


// Protect the route using auth middleware
router.put('/update-display-picture', auth, updateDP)
router.put('/update-profile', auth, updateProfile);
router.get('/get-user-details', auth, getUserDetails);
router.delete('/delete-account', auth, deleteAccount);

// route to get instructor dashboard data
router.get("/instructor-dashboard-data", auth, isInstructor, getInstructorDashboardData);



module.exports = router;