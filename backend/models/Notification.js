

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sendSMSFlag: { type: Boolean, default: false },
  recipientType: { type: String, enum: [
    "all_students",
    "specific_class",
    "specific_course",
    "specific_subject",
    "all_teachers",
    "specific_teacher_class",
    "specific_teacher_course",
    "specific_teacher_subjects",
    "everyone"
  ], required: true },
  className: { type: String },
  courseName: { type: String },
  subjectName: { type: String },
  sendToParents: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
