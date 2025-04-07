const express = require('express');
const { getAllUsers, editUser, deleteUser, getAllStudents, getAllTeachers } = require('../controllers/userController');
const { isAdmin, excludePassword } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/users', isAdmin, getAllUsers);

router.get('/students',isAdmin, getAllStudents);
router.get('/teachers',isAdmin, getAllTeachers);



router.put('/users/:userId', isAdmin, excludePassword, editUser);

router.delete('/users/:userId', isAdmin, deleteUser);

module.exports = router;
