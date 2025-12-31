const express = require('express');
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/auth");

// import controllers fn
const { updateProfile, deleteAccount, getUserDetails, updateDP, getInstructorDashboardData } = require("../controllers/Profile");

const {sendPhoneOtp, verifyPhoneOtp} = require('../controllers/PhoneOtp')

// Protect the route using auth middleware
router.put('/update-display-picture', auth, updateDP)
router.put('/update-profile', auth, updateProfile);
router.get('/get-user-details', auth, getUserDetails);
router.delete('/delete-account', auth, deleteAccount);

// phone verification routes
router.post('/send-phone-otp', auth, sendPhoneOtp)
router.post('/verify-phone-otp', auth, verifyPhoneOtp)

// route to get instructor dashboard data
router.get("/instructor-dashboard-data", auth, isInstructor, getInstructorDashboardData);

module.exports = router;