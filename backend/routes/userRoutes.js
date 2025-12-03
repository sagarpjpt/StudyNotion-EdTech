const express = require('express');
const router = express.Router();
const { auth } = require("../middlewares/auth");

// import controllers fn
const {resetPasswordToken, resetPassword} = require('../controllers/ResetPassword');
const { sendOtp, signUp, login, changePassword, meController, logout } = require('../controllers/Auth');

router.post('/sendotp', sendOtp);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout)

// protected routes
router.post('/reset-password-token', resetPasswordToken);
router.post('/reset-password', resetPassword);
router.put("/changepassword", auth, changePassword);
router.get('/me', auth, meController)

module.exports = router;