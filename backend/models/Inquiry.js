const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  enquiryMode: { type: String, enum: ['call', 'email', 'in-person'], required: true },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' }, 
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
module.exports = Inquiry;
