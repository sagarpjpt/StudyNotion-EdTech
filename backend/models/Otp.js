const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate =
  require("../mail/templates/emailVerificationTemplate").default;
const otpSchema = new mongoose.Schema({
  // used for email otp
  email: {
    type: String,
  },
  // used for phone otp
  phone: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  // tells what kind of otp this is very imp so we dont mix up email & phone logic
  type: {
    type: String,
    enum: ["email", "phone"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    /*
        Step	            Old Code Behavior	                      Fixed Code Behavior
        Server start	     Date.now() runs once → constant date	  Date.now stored as function
        First OTP	         uses old timestamp	                    uses current time
        TTL index	         thinks doc is expired	                expires after 5 min
        Result	           instantly deleted	                    lives for 5 min ✅
    
    */
    expires: 5 * 60, // this document expires in 5 min
  },
});

// fn to send a mail
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      otpTemplate(otp)
    );
    console.log("email sent successfully", mailResponse);
  } catch (error) {
    console.log("error occured while sending mail", error);
    throw error;
  }
}

// send email only when otp type is email
otpSchema.pre("save", async function (next) {
  if (this.type !== "email") return next();
  // send email
  await sendVerificationEmail(this.email, this.otp);
  next(); // go to next middleware
});

module.exports = mongoose.model("Otp", otpSchema);
