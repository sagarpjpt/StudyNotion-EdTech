const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const { capturePayment } = require("../controllers/Payments");

// create order
router.post("/capturepayment", capturePayment);

// webhook or verifySignature
// router.post("/webhook", bodyParser.raw({ type: "application/json" }), verifySignature);

module.exports = router;
