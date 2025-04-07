const express = require("express");
const router = express.Router();
const marksController = require("../controllers/marksController");
const { authMiddleware} = require("../middlewares/authMiddleware");


// 1️⃣ Get students by course, class & subject
router.get("/students", marksController.getStudentsByFilter);

// 2️⃣ Upload student marks
router.post("/",authMiddleware, marksController.uploadMarks);

// 3️⃣ Edit marks
router.put("/edit", authMiddleware, marksController.editMarks);

// 4️⃣ Delete marks
router.delete("/delete", authMiddleware, marksController.deleteMarks);

// 5️⃣ Generate monthly performance report (Excel)
//router.get("/report", marksController.generatePerformanceReport);

// 6️⃣ Send SMS to parents with performance report link
//router.post("/send-report-sms", marksController.sendPerformanceReportSMS);

// 7️⃣ Get student dashboard data (tests + charts)
router.get("/dashboard/:studentId", marksController.getStudentDashboard);


router.get("/teacher", authMiddleware, marksController.getTeacherMarks);

module.exports = router;
