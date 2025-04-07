
const Inquiry = require('../models/Inquiry'); 
const inquiriesService = require("../services/inquiriesService");

exports.submitInquiry = async (req, res) => {
  const { contactNumber, email, enquiryMode } = req.body;

  try {
    const newInquiry = new Inquiry({
      contactNumber,
      email,
      enquiryMode,
      status: 'pending', 
    });

    await newInquiry.save();
    res.status(200).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ message: 'Error submitting inquiry' });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Inquiry.find();
    res.status(200).json(enquiries);
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({ message: "Error fetching enquiries" });
  }
};

exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Inquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json(enquiry);
  } catch (error) {
    console.error("Error fetching enquiry by ID:", error);
    res.status(500).json({ message: "Error fetching enquiry" });
  }
};



exports.respondToInquiry = async (req, res) => {
  try {
    const responseMessage = await inquiriesService.respondToInquiry(req.params.id);
    res.json({ success: true, message: responseMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEnquiryStatus = async (req, res) => {
  const { status } = req.body;
  console.log("Received status update:", status);  

  try {
    const enquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json(enquiry);
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    res.status(500).json({ message: "Error updating enquiry status" });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    res.status(500).json({ message: "Error deleting enquiry" });
  }
};


{/*
exports.deleteOldResolvedInquiries = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Inquiry.deleteMany({
      status: "resolved",
      updatedAt: { $lte: thirtyDaysAgo },
    });

    console.log(`Deleted ${result.deletedCount} old resolved inquiries.`);
  } catch (error) {
    console.error("Error deleting old resolved inquiries:", error);
  }
};

*/}