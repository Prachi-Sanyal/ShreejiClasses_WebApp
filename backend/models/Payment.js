
 {/*
 const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  paymentType: { type: String, enum: ["full", "installment"], required: true },
  installmentPlan: { type: String, enum: ["3 Months", "6 Months"], required: false },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
});

module.exports = mongoose.model("Payment", PaymentSchema);


*/}


{/*
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalFee: { type: Number, required: true },  // 🔹 Total course/event fee
  paidAmount: { type: Number, default: 0 },  // 🔹 Total amount paid till now
  remainingAmount: { type: Number },  // 🔹 Remaining fee amount
  amount: { type: Number, required: true },  // 🔹 Last paid installment amount
  paymentType: { type: String, enum: ["full", "installment"], required: true },
  installmentPlan: { type: String, enum: ["3 Months", "6 Months"], required: false },
  remainingInstallments: { type: Number, default: 0 },  // 🔹 Remaining installments
  nextDueDate: { type: String, default: null },  // 🔹 Next due date for installment
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
}, { timestamps: true }); // 🔹 Automatically adds createdAt & updatedAt timestamps

module.exports = mongoose.model("Payment", PaymentSchema);
*/}


{/*
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalFee: { type: Number, required: true }, // Total course/event fee
    paidAmount: { type: Number, default: 0 }, // Total amount paid till now
    remainingAmount: { type: Number }, // Remaining fee amount
    amount: { type: Number, required: true }, // Last paid installment amount
    paymentType: { type: String, enum: ["full", "installment"], required: true },
    
    // Installment details
    installmentPlan: { type: String, enum: ["3 Months", "6 Months"], required: false },
    remainingInstallments: { type: Number, default: 0 },
    nextDueDate: { type: Date, default: null },
    
    // Dynamic Status based on Installments
    status: { type: String, enum: ["pending", "paid", "installments_pending", "completed"], default: "pending" },
    
    // Razorpay transaction details
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

// Middleware to auto-calculate remainingAmount, remainingInstallments, and nextDueDate
PaymentSchema.pre("save", function (next) {
  if (this.paymentType === "installment") {
    this.remainingAmount = this.totalFee - this.paidAmount;
    
    if (this.installmentPlan === "3 Months") {
      this.nextDueDate = new Date();
      this.nextDueDate.setMonth(this.nextDueDate.getMonth() + 3);
      this.nextDueDate.setDate(this.nextDueDate.getDate() - 2);
    } else if (this.installmentPlan === "6 Months") {
      this.nextDueDate = new Date();
      this.nextDueDate.setMonth(this.nextDueDate.getMonth() + 6);
      this.nextDueDate.setDate(this.nextDueDate.getDate() - 2);
    }
    
    this.remainingInstallments = Math.ceil(this.remainingAmount / this.amount);
    this.status = this.remainingInstallments > 0 ? "installments_pending" : "completed";
  } else {
    this.remainingAmount = 0;
    this.remainingInstallments = 0;
    this.nextDueDate = null;
    this.status = "paid";
  }
  next();
});

module.exports = mongoose.model("Payment", PaymentSchema);

*/}

const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalFee: { type: Number, required: true }, 
    paidAmount: { type: Number, default: 0 }, 
    remainingAmount: { type: Number }, 
    amount: { type: Number, required: true }, 
    paymentType: { type: String, enum: ["full", "installment"], required: true },
    
    installmentPlan: { type: String, enum: ["3 Months", "6 Months"], required: false },
    remainingInstallments: { type: Number, default: 0 },
    nextDueDate: { type: Date, default: null },

    status: { type: String, enum: ["pending", "paid", "installments_pending", "completed", "overdue"], default: "pending" },
    
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
