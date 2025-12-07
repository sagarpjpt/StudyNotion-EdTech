const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const Payment = require("../models/Payment");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const crypto = require("crypto");
const { paymentSuccess } = require("../mail/templates/paymentSuccess");

exports.capturePayment = async (req, res) => {
  try {
    // Accept either courseId (string) OR courseIds (array)
    let { courseId, courseIds, userId } = req.body;

    // console.log("REQ BODY:", req.body);

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    // normalize to array
    let coursesArray = [];
    if (courseIds && Array.isArray(courseIds) && courseIds.length > 0) {
      coursesArray = courseIds;
    } else if (courseId) {
      coursesArray = [courseId];
    } else {
      return res
        .status(400)
        .json({ success: false, message: "courseId or courseIds required" });
    }

    // fetch courses and compute total
    const courses = await Course.find({ _id: { $in: coursesArray } });
    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No valid courses found" });
    }

    // check for any missing ids
    const foundIds = courses.map((c) => c._id.toString());
    const missing = coursesArray.filter((id) => !foundIds.includes(id));
    if (missing.length) {
      return res.status(404).json({
        success: false,
        message: `Courses not found: ${missing.join(",")}`,
      });
    }

    // validate user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // filter out courses user already enrolled in
    const notEnrolledCourses = courses.filter(
      (c) => !user.courses.includes(c._id.toString())
    );
    if (notEnrolledCourses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User already enrolled in all selected courses",
      });
    }

    // compute total amount (INR paise)
    const totalAmount = notEnrolledCourses.reduce(
      (sum, c) => sum + c.price * 100,
      0
    );

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
      notes: {
        userId: userId,
        // store course ids as JSON string
        courseIds: JSON.stringify(
          notEnrolledCourses.map((c) => c._id.toString())
        ),
      },
    };

    const order = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      // optionally return course summary to frontend
      courses: notEnrolledCourses.map((c) => ({
        _id: c._id,
        courseName: c.courseName,
        price: c.price,
        thumbnail: c.thumbnail,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

exports.verifySignature = async (req, res) => {
  try {
    console.log("RAW BODY:", req.body);
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const digest = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body) //raw buffer
      .digest("hex");

    if (digest !== signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Convert raw buffer to JSON
    const body = JSON.parse(req.body.toString("utf8"));
    console.log("EVENT RECEIVED:", body.event);

    const event = body.event;
    if (event !== "payment.captured") {
      return res
        .status(200)
        .json({ success: true, message: `Ignored event: ${event}` });
    }

    // Extract payment entity
    const paymentEntity = body.payload.payment.entity;

    const notes = paymentEntity.notes || {};
    const userId = notes.userId;
    const courseIds = JSON.parse(notes.courseIds || "[]");

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // SAVE PAYMENT RECORD IN DB
    const paymentRecord = await Payment.create({
      razorpayPaymentId: paymentEntity.id,
      razorpayOrderId: paymentEntity.order_id,
      razorpaySignature: signature,
      amount: paymentEntity.amount,
      currency: paymentEntity.currency,
      userId: userId,
      courseIds: courseIds,
      status: paymentEntity.status || "captured",
    });

    console.log("Payment Saved:", paymentRecord);

    // sending payment success email
    await mailSender(
      user.email,
      "Payment Successful - StudyNotion",
      paymentSuccess(
        paymentEntity.amount / 100, // convert paise to rs
        paymentEntity.id, // paymentId
        paymentEntity.order_id, // orderId
        user.firstName,
        user.lastName
      )
    );

    // Enroll user in each course
    for (const cId of courseIds) {
      if (!user.courses.includes(cId)) {
        user.courses.push(cId);
      }

      const course = await Course.findById(cId);
      if (course && !course.studentsEnrolled.includes(userId)) {
        course.studentsEnrolled.push(userId);
        await course.save();

        const emailResponse = await mailSender(
          user.email,
          "Congratulations! You've been enrolled in a new course",
          courseEnrollmentEmail(course.courseName, user.firstName)
        );
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified, saved & user enrolled",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};
