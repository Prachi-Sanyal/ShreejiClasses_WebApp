

const PDFDocument = require("pdfkit");
const fs = require("fs");
const moment = require("moment");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const FeeDetails = require("../models/FeeDetails");
const User = require("../models/User");
const Payment = require("../models/Payment");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const getStudentFeeDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "student") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check existing payments
    const payments = await Payment.find({ userId: req.user.id });

    if (payments.length > 0) {
      const latestPayment = payments[payments.length - 1]; // Get latest payment record

      // ✅ Case 1: If status is "pending", get fee details from FeeDetails collection
      if (latestPayment.status === "pending") {
        const feeDetails = await FeeDetails.findOne({
          selectedCourse: user.selectedCourse[0],
          studentClass: parseInt(user.studentClass[0]),
        });

        if (!feeDetails) {
          return res.status(404).json({ error: "Fee details not found" });
        }

        const subjectFees = feeDetails.subjects.filter(subject =>
          user.subjects.includes(subject.name)
        );

        let totalYearlyFee = subjectFees.reduce(
          (total, subject) => total + subject.monthlyFee * 12,
          0
        );

        return res.status(200).json({
          selectedCourse: feeDetails.selectedCourse,
          studentClass: feeDetails.studentClass,
          subjects: subjectFees,
          fullYearlyFee: totalYearlyFee,
          hasPaidBefore: false,
        });
      }

      // ✅ Case 2: If status is NOT "pending", return payment history
      return res.status(200).json({
        paymentHistory: payments,
        hasPaidBefore: true,
      });
    }

    // ✅ Case 3: No payment records found, fetch fee details from FeeDetails
    const feeDetails = await FeeDetails.findOne({
      selectedCourse: user.selectedCourse[0],
      studentClass: parseInt(user.studentClass[0]),
    });

    if (!feeDetails) {
      return res.status(404).json({ error: "Fee details not found" });
    }

    const subjectFees = feeDetails.subjects.filter(subject =>
      user.subjects.includes(subject.name)
    );

    let totalYearlyFee = subjectFees.reduce(
      (total, subject) => total + subject.monthlyFee * 12,
      0
    );

    res.status(200).json({
      selectedCourse: feeDetails.selectedCourse,
      studentClass: feeDetails.studentClass,
      subjects: subjectFees,
      fullYearlyFee: totalYearlyFee,
      hasPaidBefore: false,
    });
  } catch (error) {
    console.error("Error fetching fee details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const createOrder = async (req, res) => {
  try {
    const { amount, paymentType, installmentPlan } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let userPayment = await Payment.findOne({ userId: req.user.id });

    // ✅ Check if full payment is already done
    if (userPayment && userPayment.status === "completed") {
      return res.status(400).json({ error: "Full payment already completed" });
    }

    let totalFee, paidAmount, remainingAmount, remainingInstallments = 0;

    if (!userPayment) {
      const feeDetails = await FeeDetails.findOne({
        selectedCourse: user.selectedCourse[0],
        studentClass: parseInt(user.studentClass[0]),
      });

      if (!feeDetails) {
        return res.status(404).json({ error: "Fee details not found" });
      }

      const subjectFees = feeDetails.subjects.filter(subject =>
        user.subjects.includes(subject.name)
      );

      totalFee = subjectFees.reduce((total, subject) => total + subject.monthlyFee * 12, 0);
      paidAmount = 0;
      remainingAmount = totalFee;

      if (installmentPlan === "3 Months") {
        remainingInstallments = 4;
      } else if (installmentPlan === "6 Months") {
        remainingInstallments = 2;
      }
    } else {
      totalFee = userPayment.totalFee;
      paidAmount = userPayment.paidAmount;
      remainingAmount = totalFee - paidAmount;
      remainingInstallments = userPayment.remainingInstallments;
    }

    if (amount > remainingAmount) {
      return res.status(400).json({ error: "Payment amount exceeds remaining fee" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      payment_capture: 1,
    });

    let nextDueDate = null;
    if (remainingInstallments > 0) {
      nextDueDate = new Date();
      if (installmentPlan === "3 Months") {
        nextDueDate.setMonth(nextDueDate.getMonth() + 3);
      } else if (installmentPlan === "6 Months") {
        nextDueDate.setMonth(nextDueDate.getMonth() + 6);
      }
    }

    if (!userPayment) {
      userPayment = new Payment({
        userId: req.user.id,
        totalFee,
        paidAmount,
        remainingAmount,
        amount,
        paymentType,
        installmentPlan,
        remainingInstallments,
        nextDueDate,
        status: "pending",
        razorpayOrderId: order.id,
      });
    } else {
      userPayment.razorpayOrderId = order.id;
    }

    await userPayment.save();

    res.status(201).json({ orderId: order.id, amount, currency: "INR" });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    // Fetch Payment Record from DB
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    // 🔐 **Verify Signature using Razorpay Secret Key**
    const secret = process.env.RAZORPAY_KEY_SECRET; // Replace with your actual Razorpay Secret Key
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.error("❌ Razorpay Signature Mismatch! Payment Verification Failed.");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ **Update Payment Record**
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.paidAmount = (payment.paidAmount || 0) + payment.amount;
    payment.remainingAmount = Math.max(0, payment.totalFee - payment.paidAmount);

    if (payment.installmentPlan && payment.installmentPlan !== "full") {
      payment.remainingInstallments = Math.ceil(payment.remainingAmount / payment.amount);
      payment.nextDueDate = payment.remainingInstallments > 0
        ? moment().add(payment.installmentPlan === "3 Months" ? 3 : 6, "months").subtract(2, "days").format("YYYY-MM-DD")
        : null;
      payment.status = payment.remainingInstallments > 0 ? "installments_pending" : "completed";
    } else {
      payment.remainingInstallments = 0;
      payment.nextDueDate = null;
      payment.status = "completed";
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};





const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id; 
    console.log("Fetching payments for user:", userId);

    const payments = await Payment.find({ userId: userId }); // ✅ Correct field name
    console.log("Payments found:", payments);

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// Get Student Payment History
const getStudentPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const paymentRecords = await Payment.find({ user: userId });

    if (paymentRecords.length === 0) {
      // If no previous payments, fetch fee details
      const user = await User.findById(userId);
      if (!user || user.role !== "student") {
        return res.status(403).json({ error: "Access denied" });
      }

      const { selectedCourse, studentClass, subjects } = user;
      const feeDetails = await FeeDetails.findOne({
        selectedCourse: selectedCourse[0],
        studentClass: parseInt(studentClass[0]),
      });

      if (!feeDetails) {
        return res.status(404).json({ error: "Fee details not found" });
      }

      return res.status(200).json({ isNewStudent: true, feeDetails });
    }

    // If previous payments exist, return payment history
    res.status(200).json({ isNewStudent: false, paymentHistory: paymentRecords });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};








const getAllPayments = async (req, res) => {
  try {
    // Fetch all payments from the database
    const payments = await Payment.find();

    // Fetch user data for each payment
    const paymentsWithUserData = await Promise.all(
      payments.map(async (payment) => {
        try {
          console.log(`Fetching user data for payment ID: ${payment._id}, User ID: ${payment.userId}`);

          const user = await User.findById(payment.userId);
          console.log(`User data fetched for User ID ${payment.userId}:`, user);

          return { ...payment._doc, user: user || null }; // Attach user data to payment
        } catch (userError) {
          console.error("Error fetching user data for payment:", payment._id, userError);
          return { ...payment._doc, user: null }; // If user fetch fails, set user to null
        }
      })
    );

    res.status(200).json(paymentsWithUserData);
  } catch (error) {
    console.error("Error fetching payments", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
};



const getAllStudentsWithPaymentStatus = async (req, res) => {
  try {
    // Step 1: Fetch all students from the Users collection
    const students = await User.find({ role: "student" });

    // Step 2: Iterate over students & check if they have a payment record
    const studentsWithPaymentStatus = await Promise.all(
      students.map(async (student) => {
        const paymentRecord = await Payment.findOne({ userId: student._id });

        let status = "pending"; // Default: No payment record = Pending

        if (paymentRecord) {
          if (paymentRecord.remainingAmount === 0) {
            status = "paid";
          } else if (new Date(paymentRecord.nextDueDate) < new Date()) {
            status = "overdue";
          } else {
            status = "installments_pending";
          }
        }

        return {
          studentId: student._id,
          name: student.name,
          email: student.email,
          class: student.studentClass || "N/A",
          course: student.selectedCourse || "N/A",
          subjects: student.subjects || "N/A",
          paymentStatus: status,
          paidAmount: paymentRecord ? paymentRecord.paidAmount : 0,
          remainingAmount: paymentRecord ? paymentRecord.remainingAmount : "N/A",
          remainingInstallments: paymentRecord && paymentRecord.remainingInstallments !== undefined ? paymentRecord.remainingInstallments : "N/A",
          nextDueDate: paymentRecord ? paymentRecord.nextDueDate : "N/A",
        };
      })
    );

    res.status(200).json(studentsWithPaymentStatus);
  } catch (error) {
    console.error("Error fetching students with payment status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




const updatePaymentStatus = async (req, res) => {
  try {
      console.log("Received Data:", req.body);

      const { userId, paidAmount, remainingAmount, status, remainingInstallments, nextDueDate, paymentType, installmentPlan } = req.body;

      // Validate ID
      if (!userId) {
          return res.status(400).json({ error: "Student ID is required." });
      }

      // Validate Numbers
      if (isNaN(paidAmount) || isNaN(remainingAmount)) {
          return res.status(400).json({ error: "paidAmount and remainingAmount must be numbers." });
      }

      if (remainingInstallments && isNaN(remainingInstallments)) {
          return res.status(400).json({ error: "remainingInstallments must be a number." });
      }

      if (nextDueDate && isNaN(new Date(nextDueDate))) {
          return res.status(400).json({ error: "Invalid nextDueDate format." });
      }

      // Admin must provide correct paymentType & installmentPlan
      if (!paymentType || !installmentPlan) {
          return res.status(400).json({ error: "Admin must provide paymentType and installmentPlan." });
      }

      // Update Payment
      const updatedPayment = await Payment.findOneAndUpdate(
          { userId: userId },
          {
              paidAmount,
              remainingAmount,
              status,
              remainingInstallments,
              nextDueDate: nextDueDate ? new Date(nextDueDate) : undefined,
              paymentType,
              installmentPlan,
          },
          { new: true, upsert: true }
      );

      if (!updatedPayment) {
          return res.status(404).json({ error: "Payment record not found." });
      }

      res.status(200).json({ message: "Payment status updated successfully", updatedPayment });
  } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: "Server error. Please try again." });
  }
};



const updateOverduePayments = async () => {
  try {
    console.log("Checking for overdue payments...");

    const today = new Date();

    // Find payments where nextDueDate has passed & status is NOT already overdue
    const overduePayments = await Payment.find({
      nextDueDate: { $lt: today }, // Due date is in the past
      remainingAmount: { $gt: 0 },  // Jinka remaining amount abhi bhi hai
      status: { $ne: "overdue" }, // Not already overdue
    });

    if (overduePayments.length === 0) {
      console.log("No overdue payments found.");
      return;
    }

    console.log(`Updating ${overduePayments.length} overdue payments...`);

    for (const payment of overduePayments) {
      await Payment.updateOne(
        { _id: payment._id },
        { $set: { status: "overdue" } } // Only update the status
      );
    }

    console.log(`Updated ${overduePayments.length} overdue payments.`);
  } catch (error) {
    console.error("Error updating overdue payments:", error);
  }
};



module.exports = { getStudentFeeDetails, createOrder, verifyPayment, getPaymentHistory, getAllPayments, updatePaymentStatus, getAllStudentsWithPaymentStatus, updateOverduePayments};











{/*
  const PDFDocument = require("pdfkit");
const fs = require("fs");
const moment = require("moment");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const FeeDetails = require("../models/FeeDetails");
const User = require("../models/User");
const Payment = require("../models/Payment");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Fetch Student Fee Details
const getStudentFeeDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "student") {
      return res.status(403).json({ error: "Access denied" });
    }

    const existingPayment = await Payment.findOne({ userId: req.user.id });

    if (!existingPayment || existingPayment.status === "pending") {
      const feeDetails = await FeeDetails.findOne({
        selectedCourse: user.selectedCourse[0],
        studentClass: parseInt(user.studentClass[0]),
      });

      if (!feeDetails) {
        return res.status(404).json({ error: "Fee details not found" });
      }

      const subjectFees = feeDetails.subjects.filter(subject =>
        user.subjects.includes(subject.name)
      );

      let totalYearlyFee = subjectFees.reduce(
        (total, subject) => total + subject.monthlyFee * 12,
        0
      );

      return res.status(200).json({
        selectedCourse: feeDetails.selectedCourse,
        studentClass: feeDetails.studentClass,
        subjects: subjectFees,
        fullYearlyFee: totalYearlyFee,
        hasPaidBefore: false,
      });
    }

    return res.status(200).json({
      paymentHistory: existingPayment,
      hasPaidBefore: true,
    });
  } catch (error) {
    console.error("Error fetching fee details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Create Razorpay Order (Full or Installment)
const createOrder = async (req, res) => {
  try {
    const { paymentType, installmentPlan } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let payment = await Payment.findOne({ userId: req.user.id });
    let totalFee, paidAmount, remainingAmount, installmentAmount, remainingInstallments;

    if (!payment) {
      const feeDetails = await FeeDetails.findOne({
        selectedCourse: user.selectedCourse[0],
        studentClass: parseInt(user.studentClass[0]),
      });

      if (!feeDetails) {
        return res.status(404).json({ error: "Fee details not found" });
      }

      const subjectFees = feeDetails.subjects.filter(subject =>
        user.subjects.includes(subject.name)
      );

      totalFee = subjectFees.reduce((total, subject) => total + subject.monthlyFee * 12, 0);
      paidAmount = 0;
      remainingAmount = totalFee;

      if (paymentType === "installment") {
        remainingInstallments = installmentPlan === "3 Months" ? 4 : 2;
        installmentAmount = totalFee / remainingInstallments;
      } else {
        remainingInstallments = 0;
        installmentAmount = totalFee;
      }
    } else {
      totalFee = payment.totalFee;
      paidAmount = payment.paidAmount;
      remainingAmount = totalFee - paidAmount;
      remainingInstallments = payment.remainingInstallments;
      installmentAmount = remainingAmount / remainingInstallments;
    }

    const order = await razorpay.orders.create({
      amount: installmentAmount * 100,
      currency: "INR",
      payment_capture: 1,
    });

    if (!payment) {
      payment = new Payment({
        userId: req.user.id,
        totalFee,
        paidAmount,
        remainingAmount,
        installmentPlan,
        remainingInstallments,
        amount: installmentAmount,
        paymentType,
        razorpayOrderId: order.id,
        status: "pending",
      });
    } else {
      payment.razorpayOrderId = order.id;
    }

    await payment.save();

    res.status(201).json({ orderId: order.id, amount: installmentAmount, currency: "INR" });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
};

// ✅ Verify Payment and Generate Receipt
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    payment.status = payment.remainingInstallments > 1 ? "installments_pending" : "completed";
    payment.paidAmount += payment.amount;
    payment.remainingAmount = payment.totalFee - payment.paidAmount;
    payment.remainingInstallments -= 1;
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    const receiptPath = `receipts/${payment._id}.pdf`;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(receiptPath));

    doc.fontSize(20).text("Fee Payment Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${payment.userId}`);
    doc.text(`Email: ${payment.email}`);
    doc.text(`Contact: ${payment.contact}`);
    doc.text(`Course: ${payment.course}`);
    doc.text(`Class: ${payment.studentClass}`);
    doc.text(`Subjects: ${payment.subjects.join(", ")}`);
    doc.text(`Amount Paid: ₹${payment.paidAmount}`);
    doc.text(`Remaining Amount: ₹${payment.remainingAmount}`);
    doc.text(`Installments Left: ${payment.remainingInstallments}`);
    doc.text(`Next Due Date: ${payment.nextDueDate || "N/A"}`);
    doc.text(`Installment Plan: ${payment.installmentPlan || "Full Payment"}`);
    doc.text(`Payment ID: ${payment.razorpayPaymentId}`);
    doc.text(`Order ID: ${payment.razorpayOrderId}`);
    doc.text(`Date: ${moment().format("DD-MM-YYYY")}`);
    
    doc.end();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      receiptPath,
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

module.exports = { getStudentFeeDetails, createOrder, verifyPayment };


*/}