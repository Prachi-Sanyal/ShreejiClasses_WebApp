const express = require("express");
const twilio = require('twilio');

const { getStudentFeeDetails, createOrder, verifyPayment, getPaymentHistory, getAllPayments, updatePaymentStatus, getAllStudentsWithPaymentStatus} = require("../controllers/feeController2"); // ✅ Correct import
const { authMiddleware} = require("../middlewares/authMiddleware");

const router = express.Router();

// Check if getStudentFeeDetails is actually a function
console.log("getStudentFeeDetails Type:", typeof getStudentFeeDetails);

router.get("/student/fees", authMiddleware, getStudentFeeDetails);

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);
router.get("/payment-history", authMiddleware, getPaymentHistory);


router.get("/all-payments", authMiddleware, getAllPayments);
router.get("/all-students-payment", authMiddleware, getAllStudentsWithPaymentStatus);

router.put("/update-payment", authMiddleware, updatePaymentStatus);


module.exports = router;
