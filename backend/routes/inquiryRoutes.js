

const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController'); 

router.post('/inquiries', inquiryController.submitInquiry);

router.get("/inquiries", inquiryController.getEnquiries);

router.get("/inquiries/:id", inquiryController.getEnquiryById);

router.put("/inquiries/:id/status", inquiryController.updateEnquiryStatus);

router.post("/inquiries/:id/respond", inquiryController.respondToInquiry);

router.delete("/inquiries/:id", inquiryController.deleteEnquiry);


module.exports = router;
