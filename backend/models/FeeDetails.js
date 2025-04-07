const mongoose = require("mongoose");

const FeeDetailsSchema = new mongoose.Schema({
  //userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  selectedCourse: { type: String, required: true },
  studentClass: { type: Number, required: true },
  subjects: [
    {
      name: String,
      monthlyFee: Number,
    },
  ],
  fullPackageMonthlyFee: Number,
  installments: [String],
});

module.exports = mongoose.model("FeeDetails", FeeDetailsSchema, "feesdetails");
