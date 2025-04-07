import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentQuiz = () => {
  const [courses, setCourses] = useState([]); // ✅ Default empty array
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subjects, setSubjects] = useState([]); // ✅ Default empty array
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [quizzes, setQuizzes] = useState([]); // ✅ Default empty array
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]); // ✅ Stores correct answers after submission

  // 🔹 Fetch student courses on mount
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/profile`, { headers: authHeader() })
      .then((res) => {
        console.log("Full API Response:", res.data);
        const user = res.data.user;

        const selectedCourse = user?.selectedCourse || [];
        setSubjects(user.subjects || []);

        if (Array.isArray(selectedCourse)) {
          setCourses(selectedCourse);
        } else {
          console.error("Error: selectedCourse is not an array!", selectedCourse);
          setCourses([]);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  // 🔹 Fetch quizzes when subject is selected
  const fetchQuizzes = (subject) => {
    setQuizzes([]); // Clear previous quizzes
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/quiz/student-quizzes?subject=${subject}`, { headers: authHeader() })
      .then((res) => {
        console.log(`Quizzes for ${subject}:`, res.data);
        setQuizzes(res.data.quizzes || []);
      })
      .catch((err) => {
        console.error(`Error fetching quizzes for ${subject}:`, err);
        setQuizzes([]); // If error, show "No quizzes available"
      });
  };

  // 🔹 Start selected quiz
  const startQuiz = (quizId) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/quiz/${quizId}`, { headers: authHeader() })
      .then((res) => {
        console.log("Quiz Details Response:", res.data);
        setQuiz(res.data);
        setAnswers({}); // Reset answers on new quiz start
        setScore(null);
        setCorrectAnswers([]); // Reset correct answers
      })
      .catch((err) => console.error("Error fetching quiz details:", err));
  };

  // 🔹 Submit quiz answers
  const submitQuiz = () => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/quiz/attempt/${quiz._id}`, { 
        answers: Object.values(answers) 
    }, { headers: authHeader() })
    .then((res) => {
      console.log("Quiz Submission Response:", res.data);
      setCorrectAnswers(res.data.correctAnswers.map(ans => ans.trim().toLowerCase())); // Ensure proper comparison
      setScore(res.data.score);
    })
    .catch((err) => console.error("Error submitting quiz:", err));
  };
  

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* 🔹 Course Selection */}
      {!selectedCourse ? (
        <>
          <h2 className="text-xl font-bold mb-2">Select a Course</h2>
          <div className="grid grid-cols-2 gap-4">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <button
                  key={index}
                  className="bg-orange text-white p-4 rounded-lg hover:bg-blue-600"
                  onClick={() => {
                    setSelectedCourse(course);
                  }}
                >
                  {course}
                </button>
              ))
            ) : (
              <p>No courses available.</p>
            )}
          </div>
        </>
      ) : !selectedSubject ? (
        <>
          {/* 🔹 Subject Selection */}
          <h2 className="text-xl font-bold mb-2">Select a Subject</h2>
          <div className="grid grid-cols-2 gap-4">
            {subjects.length > 0 ? (
              subjects.map((subject, index) => (
                <button
                  key={index}
                  className="bg-green text-white p-4 rounded-lg hover:bg-green-600"
                  onClick={() => {
                    setSelectedSubject(subject);
                    fetchQuizzes(subject);
                  }}
                >
                  {subject}
                </button>
              ))
            ) : (
              <p>No subjects available.</p>
            )}
          </div>
        </>
      ) : quiz ? (
        <>
          {/* 🔹 Quiz Questions */}
          <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
          {quiz.questions.map((q, index) => (
            <div key={index} className="mb-4">
              <p className="font-medium">{q.question}</p>
              {q.options.map((opt) => {
                const correctAnswer = correctAnswers[index]?.trim().toLowerCase();
                const selectedAnswer = answers[index]?.trim().toLowerCase();
                const isCorrect = correctAnswer === opt.trim().toLowerCase();
                const isSelected = selectedAnswer === opt.trim().toLowerCase();
                const isWrong = isSelected && !isCorrect;

                return (
                  <label
                    key={opt}
                    className={`block p-2 rounded ${
                      isCorrect ? "bg-green" : isWrong ? "bg-orange" : "bg-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${index}`}
                      value={opt}
                      checked={isSelected}
                      onChange={() => setAnswers({ ...answers, [index]: opt })}
                      disabled={score !== null} 
                      className="mr-2"
                      // Prevent changing answers after submission
                    />
                    {opt}
                    
                  </label>
                );
              })}
            </div>
          ))}
          <button className="bg-green text-white p-2 rounded mt-4" onClick={submitQuiz} disabled={score !== null}>
            Submit Quiz
          </button>
          {score !== null && (
            <p className="mt-2 font-bold">Your Score: {score} / {quiz.questions.length}</p>
          )}
        </>
      ) : (
        <>
          {/* 🔹 Quiz Selection */}
          <h2 className="text-xl font-bold mb-2">Available Quizzes</h2>
          {quizzes.length > 0 ? (
            quizzes.map((q, index) => (
              <button
                key={index}
                className="bg-orange text-white p-4 rounded-lg block w-full mt-2"
                onClick={() => startQuiz(q._id)}
              >
                {q.title}
              </button>
            ))
          ) : (
            <p>No quizzes available for this subject.</p>
          )}
        </>
      )}
    </div>
  );
};

// 🔹 Function to get Authorization token
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default StudentQuiz;
