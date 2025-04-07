import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash, Edit, X, Save } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const TeacherQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [subjects, setSubjects] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      if (!token) {
        console.error("Token not found");
        return;
      }
      const decodedToken = jwtDecode(token);
      const creatorId = decodedToken.userId || decodedToken.id || decodedToken._id;

      if (!creatorId) {
        console.error("Creator ID not found in token");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/quiz/createdBy/${creatorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error.response?.data || error.message);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleCancelQuestion = (index) => {
    setQuestions(questions.filter((_, qIndex) => qIndex !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/quiz/delete/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuizId(quiz._id);
    setTitle(quiz.title);
    setSelectedCourse(quiz.selectedCourse);
    setStudentClass(quiz.studentClass);
    setSubjects(quiz.subjects);
    setQuestions(quiz.questions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = { title, selectedCourse, studentClass, subjects, questions };

    try {
      if (editingQuizId) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/quiz/update/${editingQuizId}`, quizData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/quiz/create`, quizData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      fetchQuizzes();
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSelectedCourse("");
    setStudentClass("");
    setSubjects("");
    setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
    setEditingQuizId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Quizzes</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />

        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="">Select Course</option>
          <option value="Grade 6-10">Grade 6-10</option>
          <option value="Grade 11-12 Science">Grade 11-12 Science</option>
          <option value="JEE/NEET/GUJCET Preparation">JEE/NEET/GUJCET Preparation</option>
        </select>

        <input type="text" placeholder="Class" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Subject" value={subjects} onChange={(e) => setSubjects(e.target.value)} className="w-full p-2 border rounded" required />

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-4 rounded space-y-2 relative">
            <h3 className="font-semibold">Question {qIndex + 1}:</h3>
            <input type="text" placeholder={`Enter Question ${qIndex + 1}`} value={q.question} onChange={(e) => handleInputChange(qIndex, "question", e.target.value)} className="w-full p-2 border rounded" required />

            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="flex items-center space-x-2">
                <span className="font-semibold">{String.fromCharCode(65 + oIndex)}.</span>
                <input type="text" placeholder={`Option ${oIndex + 1}`} value={option} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} className="w-full p-2 border rounded" required />
              </div>
            ))}

            <div className="bg-green-200 p-2 rounded">
              <label className="font-semibold">Correct Answer:</label>
              <input type="text" placeholder="Enter Correct Answer" value={q.correctAnswer} onChange={(e) => handleInputChange(qIndex, "correctAnswer", e.target.value)} className="w-full p-2 border rounded bg-white" required />
            </div>

           
           
            <button type="button" onClick={() => handleCancelQuestion(qIndex)} className="absolute top-2 right-2 text-gray-600 hover:text-red-600">
              <X />
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddQuestion} className="px-4 py-2 border rounded"> <Plus className="mr-2" /> Add Question</button>
        <button type="submit" className="px-4 py-2 bg-green text-white rounded hover:bg-green-600">{editingQuizId ? <Save className="mr-2 inline" /> : "Upload Quiz"}</button>
        {editingQuizId && <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>}     
      </form>

      <h3 className="text-xl font-semibold mt-6">Your Quizzes</h3>
      <ul className="mt-4 space-y-2">
        {quizzes.map((quiz) => (
          <li key={quiz._id} className="flex justify-between items-center p-4 border rounded">
            <div><strong>{quiz.title}</strong> - {quiz.selectedCourse}, {quiz.studentClass}, {quiz.subjects}</div>
            <div className="flex space-x-2">
              <button onClick={() => handleEditQuiz(quiz)} className="p-2 border rounded"><Edit /></button>
              <button onClick={() => handleDeleteQuiz(quiz._id)} className="p-2 border rounded"><Trash /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherQuizzes;
