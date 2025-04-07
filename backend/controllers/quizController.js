const Quiz = require('../models/Quiz');
const mongoose = require("mongoose");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const sharp = require("sharp");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

exports.createQuiz = async (req, res) => {
    try {
      const { title, selectedCourse, studentClass, subjects, questions, timeLimit } = req.body;
  
      const formattedQuestions = questions.map((q) => ({
        question: q.question,
        options: q.options, 
        correctAnswer: q.correctAnswer, 
      }));
  
      const newQuiz = new Quiz({
        title,
        selectedCourse,
        studentClass,
        subjects,
        createdBy: req.user._id,
        questions: formattedQuestions, 
        timeLimit: timeLimit || null, 
      });
  
      await newQuiz.save();
      res.status(201).json(newQuiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
exports.getQuizzes = async (req, res) => {
  try {
    console.log("Fetching all quizzes...");
    const quizzes = await Quiz.find().populate('createdBy', 'name email');
    console.log("Quizzes fetched:", quizzes);
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to edit this quiz" });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this quiz" });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


{/*
exports.attemptQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const { answers } = req.body; 
    let score = 0;

    quiz.questions.forEach((q, index) => {
      if (answers[index] && answers[index] === q.correctAnswer) {
        score++;
      }
    });

    res.json({ message: "Quiz submitted!", totalQuestions: quiz.questions.length, score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/}


exports.attemptQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const { answers } = req.body; 
    let score = 0;
    let correctAnswers = [];

    quiz.questions.forEach((q, index) => {
      correctAnswers.push(q.correctAnswer); // ✅ Collect correct answers
      if (answers[index] && answers[index] === q.correctAnswer) {
        score++;
      }
    });

    res.json({ 
      message: "Quiz submitted!", 
      totalQuestions: quiz.questions.length, 
      score,
      correctAnswers // ✅ Now included in response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getQuizzesByTeacher = async (req, res) => {
  try {
    const { creatorId } = req.params;

    console.log("🟢 Received creatorId:", creatorId, "Type:", typeof creatorId);

    // Ensure creatorId is a valid ObjectId string before conversion
    if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) {
      return res.status(400).json({ message: "Invalid creator ID format." });
    }

    // Convert creatorId to ObjectId
    const teacherObjectId = new mongoose.Types.ObjectId(creatorId);
    console.log("🔵 Converted to ObjectId:", teacherObjectId);

    // Fetch quizzes
    const quizzes = await Quiz.find({ createdBy: teacherObjectId });

    if (!quizzes.length) {
      return res.status(404).json({ message: "No quizzes found for this teacher." });
    }

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error("🔥 Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





exports.getStudentQuizzes = async (req, res) => {
  try {
    console.log("Authenticated User:", req.user); // Debugging step

    const { selectedCourse, studentClass, subjects } = req.user;
    const selectedSubject = req.query.subject; // 🔹 Get selected subject from frontend

    if (!selectedCourse || !studentClass || !subjects || subjects.length === 0) {
      return res.status(400).json({ message: "Incomplete student details" });
    }

    const quizzes = await Quiz.find({
      selectedCourse,
      studentClass,
      
      subjects: selectedSubject 
      

    });

    if (!quizzes.length) {
      return res.status(404).json({ message: "No quizzes available for your selection" });
    }

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes for student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

{/*

exports.extractFromPDF = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const data = await pdfParse(req.file.buffer);
        const text = data.text;

        const extractedQuestions = extractQuestionsFromText(text);

        res.json({ questions: extractedQuestions });
    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ error: "Failed to extract questions" });
    }
};

function extractQuestionsFromText(text) {
    const questionPattern = /(\d+)\.\s(.*?)(?=(\d+\.)|$)/gs;
    let matches, questions = [];

    while ((matches = questionPattern.exec(text)) !== null) {
        let questionText = matches[2].trim();
        let options = ["Option A", "Option B", "Option C", "Option D"];

        questions.push({ question: questionText, options, correctAnswer: "" });
    }

    return questions;
}


*/}


exports.extractFromPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Parse PDF to extract text
        const data = await pdfParse(req.file.buffer);
        const text = data.text;

        console.log("Extracted Text:", text); // Debugging: Print extracted text

        // Process extracted text to identify questions and options
        const extractedQuestions = extractQuestionsFromText(text);

        res.json({ questions: extractedQuestions });
    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ error: "Failed to extract questions" });
    }
};

// 🟢 Function to extract MCQs (Questions + Options + Correct Answer if mentioned)
function extractQuestionsFromText(text) {
    const questionPattern = /(\d+)\.\s(.*?)(?=(\n\d+\.|\n*$))/gs; // Detects numbered questions
    const optionPattern = /([A-D])\)\s(.*?)(?=\n[A-D]\)|\n*$)/g; // Extracts options A) B) C) D)
    const correctAnswerPattern = /Answer:\s*([A-D])/i; // Extracts correct answer if specified

    let matches;
    let questions = [];

    while ((matches = questionPattern.exec(text)) !== null) {
        let questionText = matches[2].trim();
        let options = [];
        let correctAnswer = "";

        // Extract options using regex
        let optionMatches;
        while ((optionMatches = optionPattern.exec(text)) !== null) {
            options.push({ option: optionMatches[1], text: optionMatches[2].trim() });
        }

        // Extract correct answer if mentioned
        let correctMatch = text.match(correctAnswerPattern);
        if (correctMatch) {
            correctAnswer = correctMatch[1]; // Extract correct answer letter
        }

        questions.push({
            question: questionText,
            options: options.length > 0 ? options : ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: correctAnswer || "Not provided"
        });
    }

    return questions;
}



exports.extractFromFile = async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }

      const fileType = req.file.mimetype;

      let extractedText = "";

      if (fileType === "application/pdf") {
          // Extract text from PDF
          const data = await pdfParse(req.file.buffer);
          extractedText = data.text;
      } else if (fileType.startsWith("image/")) {
          // Convert image to text using OCR
          extractedText = await extractTextFromImage(req.file.buffer);
      } else {
          return res.status(400).json({ error: "Unsupported file format. Please upload a PDF or an image." });
      }

      console.log("Extracted Text:", extractedText); // Debugging

      // Process text to extract MCQs
      const extractedQuestions = extractQuestionsFromText(extractedText);

      res.json({ questions: extractedQuestions });
  } catch (error) {
      console.error("Error processing file:", error);
      res.status(500).json({ error: "Failed to extract questions" });
  }
};

// Function to extract text from an image using OCR
async function extractTextFromImage(imageBuffer) {
  try {
      // Preprocess image for better OCR accuracy
      const processedImage = await sharp(imageBuffer)
          .resize(1000) // Resize to improve accuracy
          .grayscale() // Convert to grayscale
          .toBuffer();

      const { data } = await Tesseract.recognize(processedImage, "eng", { logger: (m) => console.log(m) });

      return data.text;
  } catch (error) {
      console.error("Error processing image:", error);
      return "";
  }
}

// Function to extract MCQs (Questions + Options + Correct Answer)
function extractQuestionsFromText(text) {
  const questionPattern = /(\d+)\.\s(.*?)(?=(\n\d+\.|\n*$))/gs; // Detects numbered questions
  const optionPattern = /([A-D])\)\s(.*?)(?=\n[A-D]\)|\n*$)/g; // Extracts options A) B) C) D)
  const correctAnswerPattern = /Answer:\s*([A-D])/i; // Extracts correct answer if specified

  let matches;
  let questions = [];

  while ((matches = questionPattern.exec(text)) !== null) {
      let questionText = matches[2].trim();
      let options = [];
      let correctAnswer = "";

      // Extract options using regex
      let optionMatches;
      while ((optionMatches = optionPattern.exec(text)) !== null) {
          options.push({ option: optionMatches[1], text: optionMatches[2].trim() });
      }

      // Extract correct answer if mentioned
      let correctMatch = text.match(correctAnswerPattern);
      if (correctMatch) {
          correctAnswer = correctMatch[1]; // Extract correct answer letter
      }

      questions.push({
          question: questionText,
          options: options.length > 0 ? options : ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: correctAnswer || "Not provided"
      });
  }

  return questions;
}