const express = require('express');
const {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse 
} = require('../controllers/courseController');
const { verifyAdmin } = require('../middlewares/authMiddleware'); 

const router = express.Router();



router.get('/', verifyAdmin, getAllCourses);  
router.post('/', verifyAdmin, addCourse);   
router.put('/:id', verifyAdmin, updateCourse); 
router.delete('/:id', verifyAdmin, deleteCourse); 

module.exports = router;
