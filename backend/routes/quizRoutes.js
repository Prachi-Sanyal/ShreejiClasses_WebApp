const express = require('express');
const multer = require("multer");
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware'); 

const {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  attemptQuiz,
  getQuizzesByTeacher,
  //extractFromPDF,
  getStudentQuizzes,
  extractFromFile
} = require('../controllers/quizController');


const upload = multer({ storage: multer.memoryStorage() });



router.post('/create', authMiddleware, createQuiz);

router.get('/', getQuizzes);

router.get('/student-quizzes', authMiddleware, getStudentQuizzes);


router.get('/:id', getQuizById);

router.put('/update/:id', authMiddleware, updateQuiz);

router.delete('/delete/:id', authMiddleware, deleteQuiz);

router.post('/attempt/:id', authMiddleware, attemptQuiz);

router.get('/createdBy/:creatorId', authMiddleware, getQuizzesByTeacher);


//router.post('/extractFromPDF', upload.single("pdf"), extractFromPDF);


//router.post("/extract-mcq", upload.single("pdfFile"), extractFromPDF);


router.post("/extract-mcq", upload.single("file"), extractFromFile);

module.exports = router;
