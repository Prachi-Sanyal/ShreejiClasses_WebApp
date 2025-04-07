const express = require('express');
const {
  getAllCourses
   
} = require('../controllers/courseFrontendController');

const router = express.Router();



router.get('/coursefrontend', getAllCourses);  


module.exports = router;
