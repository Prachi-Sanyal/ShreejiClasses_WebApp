import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Attendance = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [subjects, setSubjects] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const courseOptions = {
    "Grade 6-10": { subjects: ["English", "Maths", "Science", "Social Science"], classes: [6, 7, 8, 9, 10] },
    "Grade 11-12 Science": { subjects: ["Physics", "Chemistry", "Biology", "Maths"], classes: [11, 12] },
    "JEE/NEET/GUJCET": { subjects: ["Physics", "Chemistry", "Biology", "Maths"], classes: [11, 12, "Others"] },
    "SOF Olympiad": { subjects: ["Maths", "Science"], classes: [6, 7, 8, 9, 10, 11, 12, "Others"] },
  };

  const handleFetchStudents = async () => {
    if (!selectedCourse || !studentClass || !subjects) {
      toast.error("Please select all fields before fetching students.");
      return;
    }
  
    console.log("Sending API request with:", { selectedCourse, studentClass, subjects });
  
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/attendance/filter`, {
        params: { course: selectedCourse, className: studentClass, subject: subjects },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("API Response:", response.data);
      setStudents(response.data);
  
      setAttendance(
        response.data.reduce((acc, student) => {
          acc[student._id] = ""; 
          return acc;
        }, {})
      );
  
    } catch (error) {
      console.error("Error fetching students", error);
      toast.error("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = async () => {
    if (students.length === 0) {
      toast.error("No students found to mark attendance.");
      return;
    }
  
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/attendance/mark`,
        {
          students: students.map((student) => ({
            id: student._id,
            status: attendance[student._id] === "present" ? "Present" : "Absent",
            selectedCourse: selectedCourse || "", 
            studentClass: studentClass || "" , 
            subjects: subjects || "",       
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      toast.success("Attendance marked successfully!");
    } catch (error) {
      console.error("Error marking attendance:", error.response?.data || error.message);
      toast.error("Failed to submit attendance.");
    }
  };
  

  return (
    <div className="p-6 w-full max-w-4xl mx-auto bg-white border border-gray-300 shadow-lg rounded-lg mt-10">
      <ToastContainer />
      <h2 className="text-lg font-bold mb-4 text-center">📌 Mark Attendance</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setStudentClass(""); 
            setSubjects(""); 
          }}
        >
          <option value="">Select Course</option>
          {Object.keys(courseOptions).map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          disabled={!selectedCourse}
        >
          <option value="">Select Class</option>
          {selectedCourse &&
            courseOptions[selectedCourse]?.classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
        </select>

        <select
          className="border p-2 rounded"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          disabled={!selectedCourse}
        >
          <option value="">Select Subject</option>
          {selectedCourse &&
            courseOptions[selectedCourse]?.subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
        </select>
      </div>

      <button
        onClick={handleFetchStudents}
        className="bg-orange text-white px-4 py-2 rounded mb-4 w-full"
        disabled={loading}
      >
        {loading ? "Loading..." : "🔍 Load Students"}
      </button>

      {students.length > 0 ? (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-white">
              <th className="border p-2">Student Name</th>
              <th className="border p-2">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2 flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name={`attendance-${student._id}`}
                      value="present"
                      checked={attendance[student._id] === "present"}
                      onChange={() => handleAttendanceChange(student._id, "present")}
                    />
                    Present
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`attendance-${student._id}`}
                      value="absent"
                      checked={attendance[student._id] === "absent"}
                      onChange={() => handleAttendanceChange(student._id, "absent")}
                    />
                    Absent
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ):(
        <p className="text-center text-red-500 font-semibold">No Students Found</p>
      )}

      {students.length > 0 && (
        <button
          onClick={handleSubmitAttendance}
          className="bg-green text-white px-4 py-2 rounded mt-4 w-full"
        >
          ✅ Submit Attendance
        </button>
      )}
    </div>
  );
};

export default Attendance;
