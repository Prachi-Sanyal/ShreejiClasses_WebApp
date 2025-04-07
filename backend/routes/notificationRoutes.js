const express = require('express');
const {
  getAllNotifications,
  createNotification,
  deleteNotification,
  markNotificationsAsRead,
  getNotifications,
  getAdminNotifications,
  getStudentNotifications,
  getTeacherNotifications,
  getTeacherNotificationsToday

} = require('../controllers/notificationController');

const { isTeacherOrAdmin, protect, verifyAdminToken, verifyStudentToken, verifyTeacherToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllNotifications);
router.get('/admin', verifyAdminToken, getAdminNotifications);
router.get('/teacher', verifyTeacherToken, getTeacherNotifications);
router.get('/teacher/new', verifyTeacherToken, getTeacherNotificationsToday);


router.get('/student', verifyStudentToken, getStudentNotifications);

router.post('/', isTeacherOrAdmin, createNotification);
router.delete('/:id', deleteNotification);
router.post('/mark-as-read', markNotificationsAsRead);
router.get('/notifications/:userId', protect, getNotifications);

module.exports = router; 
