const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select('-password');  
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
};




const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('-password')  
      .populate('taughtCourses', 'name')  
      .populate('teacherSubjects', 'name');  

    res.status(200).json({ teachers }); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error });
  }
};



const editUser = async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);  

    const { userId } = req.params;
    const { name, email, role, contactNumber, parentContactNumber, studentClass, selectedCourse, subjects, teachesClass, taughtCourses, teacherSubjects } = req.body;

    const user = await User.findById(userId).select('-password');  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.contactNumber = contactNumber || user.contactNumber;
    user.parentContactNumber = parentContactNumber || user.parentContactNumber;
    user.studentClass = studentClass || user.studentClass;
    user.selectedCourse = selectedCourse || user.selectedCourse;
    user.subjects = subjects || user.subjects;
    user.teachesClass = teachesClass || user.teachesClass;
    user.taughtCourses = taughtCourses || user.taughtCourses;
    user.teacherSubjects = teacherSubjects || user.teacherSubjects;

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};


module.exports = {
  getAllUsers,
  editUser,
  deleteUser,
  getAllStudents,
  getAllTeachers,
 
};
