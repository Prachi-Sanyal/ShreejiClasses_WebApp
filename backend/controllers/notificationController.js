const Notification = require('../models/Notification');
const { sendSMS } = require('../services/smsService'); 
const User = require('../models/User'); 
const twilio = require('twilio');
const moment = require('moment');  // Ensure you install moment.js


const studentsPhoneNumbers = ['+919558787469'];
const teachersPhoneNumbers = ['+917226967838'];
const parentsPhoneNumbers = ['+919925097306'];


const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);



exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};


exports.getAdminNotifications = async (req, res) => {
  try {
    const adminId = req.userId; 

    const notifications = await Notification.find({ sender: adminId }).populate('sender', 'name').sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};


exports.getTeacherNotifications = async (req, res) => {
  try {
    const teacherId = req.userId; 
    console.log("Extracted Teacher ID from Token:", teacherId); 

    const notifications = await Notification.find({ sender: teacherId })
      .populate('sender', 'name role')
      .sort({ createdAt: -1 });

      console.log("Fetched Notifications:", notifications); 


    const teacherNotifications = notifications.filter(
      (notif) => notif.sender?.role === "teacher"
    );

    res.status(200).json(teacherNotifications);
  } catch (error) {
    console.error('Error fetching teacher notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};


exports.getStudentNotifications = async (req, res) => {
  try {
    const studentId = req.userId; 

    console.log("Fetching student with ID:", studentId);

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { selectedCourse, studentClass, subjects } = student;

    console.log("Student Class:", studentClass);
    console.log("Selected Course:", selectedCourse);
    console.log("Subjects:", subjects);

    const query = {
      $or: [
        { recipientType: "all_students" },
        { recipientType: "specific_class", className: studentClass },
        { recipientType: "specific_course", courseName: selectedCourse },
        { recipientType: "specific_subject", subjectName: { $in: subjects } },
        { recipientType: "everyone" }
      ],
    };

    console.log("Querying Notifications with:", query);

    const notifications = await Notification.find(query)
      .populate("sender", "name")
      .sort({ createdAt: -1 });

    console.log("Notifications Found:", notifications.length);

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};










exports.getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const userRole = user.role;
    let queryConditions = [];

    if (userRole === 'student') {
      queryConditions.push(
        { recipientType: 'specific_class', className: { $in: user.studentClass } },
        { recipientType: 'specific_course', courseName: { $in: user.selectedCourse } },
        { recipientType: 'specific_subject', subjectName: { $in: user.subjects } }
      );
    }

    if (userRole === 'teacher') {
      queryConditions.push(
        { recipientType: 'specific_teacher_class', className: { $in: user.teachesClass } },
        { recipientType: 'specific_teacher_course', courseName: { $in: user.taughtCourses } },
        { recipientType: 'specific_teacher_subjects', subjectName: { $in: user.teacherSubjects } }
      );
    }

    const notifications = await Notification.find({ $or: queryConditions });

    if (!notifications.length) {
      return res.status(404).json({ success: false, message: 'No notifications found for this user.' });
    }

    res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully.',
      notifications,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications.',
      error: error.message,
    });
  }
};




exports.markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications", error });
  }
};


 
  
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};




const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber.startsWith('+91')) {
    return '+91' + phoneNumber;
  }
  return phoneNumber;
};



exports.createNotification = async (req, res) => {
  try {
    const { title, message, sender, sendSMSFlag, recipientType, className, courseName, subjectName, sendToParents } = req.body;

    if (!sender) {
      return res.status(400).json({ success: false, message: 'Sender is required.' });
    }

    const senderUser = await User.findById(sender);
    if (!senderUser) {
      return res.status(404).json({ success: false, message: 'Sender not found.' });
    }

    if (senderUser.role !== 'teacher' && senderUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Sender must be a teacher or admin.',
      });
    }

    if (senderUser.role !== 'admin' && (recipientType.includes('teacher') || recipientType === 'all_teachers')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to send notifications to teachers',
      });
    }

    if (!title || !message || !recipientType) {
      return res.status(400).json({ success: false, message: 'Title, message, and recipientType are required.' });
    }

    const newNotification = new Notification({
      title,
      message,
      sender,
      sendSMS: sendSMSFlag,
      recipientType,
      className,
      courseName,
      subjectName,
      sendToParents
    });

    await newNotification.save();

   



let recipients = [];
let validRecipients = [];

if (recipientType === 'all_students') {
  recipients = await User.find({ role: 'student' });
  validRecipients = recipients;
} else if (recipientType === 'specific_class') {
  recipients = await User.find({ studentClass: { $in: [className] }, role: 'student' });
  validRecipients = recipients;
} else if (recipientType === 'specific_course') {
  recipients = await User.find({ selectedCourse: { $in: [courseName] }, role: 'student' });
  validRecipients = recipients;
} else if (recipientType === 'specific_subject') {
  recipients = await User.find({
    subjects: { $in: [subjectName] },
    studentClass: { $in: [className] },
    role: 'student'
  });
  validRecipients = recipients;
} else if (recipientType === 'all_teachers') {
  recipients = await User.find({ role: 'teacher' });
  validRecipients = recipients;
} else if (recipientType === 'specific_teacher_class') {
  recipients = await User.find({ teachesClass: { $in: [className] }, role: 'teacher' });
  validRecipients = recipients;
} else if (recipientType === 'specific_teacher_course') {
  recipients = await User.find({ taughtCourses: { course: courseName }, role: 'teacher' });
  validRecipients = recipients;
} else if (recipientType === 'specific_teacher_subjects') {
  recipients = await User.find({
    teacherSubjects: { subject: subjectName },
    teachesClass: { $in: [className] },
    role: 'teacher'
  });
  validRecipients = recipients;
} else if (recipientType === 'everyone') {
  const students = await User.find({ role: 'student' });
  const teachers = await User.find({ role: 'teacher' });
  validRecipients = [...students, ...teachers];
}

if (validRecipients.length === 0) {
  return res.status(404).json({
    success: false,
    message: 'No recipients found for this class, course, or subject.',
  });
}

    
    for (const recipient of validRecipients) {
      if (!recipient.notifications) {
        recipient.notifications = [];
      }
      recipient.notifications.push(newNotification._id);
      await recipient.save();
    }



    if (sendSMSFlag) {
      for (const recipientDetail of validRecipients) {
        let numbersToSend = [];
    
        if (recipientDetail.contactNumber) {
          numbersToSend.push(formatPhoneNumber(recipientDetail.contactNumber));
        }
    
        if (recipientDetail.parentContactNumber) {
          numbersToSend.push(formatPhoneNumber(recipientDetail.parentContactNumber));
        }
    
        if (numbersToSend.length > 0) {
          await sendSMS(numbersToSend, message);
        }
      }
    }
    
    
      
    
    

    res.status(201).json({
      success: true,
      message: 'Notification created and sent successfully!',
      notification: newNotification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating notification',
      error: error.message,
    });
  }
};



exports.getTeacherNotificationsToday = async (req, res) => {
  try {
    const teacherId = req.userId; 
    const todayStart = moment().startOf('day').toDate(); 
    const todayEnd = moment().endOf('day').toDate(); 

    const notifications = await Notification.find({
      receiver: teacherId,
      createdAt: { $gte: todayStart, $lte: todayEnd }  // Filter only today's notifications
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};
