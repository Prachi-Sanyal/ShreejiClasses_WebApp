import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentStudyMaterial = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [studyMaterials, setStudyMaterials] = useState([]);

  // 🔹 Fetch Student Profile (Courses & Subjects)
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

  // 🔹 Fetch Study Materials when Subject is Selected
  const fetchStudyMaterials = (subject) => {
    setStudyMaterials([]); // Clear previous materials
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/materials/student?subject=${subject}`, { headers: authHeader() })
      .then((res) => {
        console.log(`Study Materials for ${subject}:`, res.data);
        setStudyMaterials(res.data.materials || []);
      })
      .catch((err) => {
        console.error(`Error fetching study materials for ${subject}:`, err);
        setStudyMaterials([]); // If error, show "No materials available"
      });
  };

  // 🔹 Handle File Download (Maintains Correct Format)
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await axios.get(fileUrl, {
        responseType: "blob", // 🔹 Get file as binary blob
      });

      // 🔹 Extract file extension from URL (e.g., .pdf, .ppt, .docx)
      const fileExtension = fileUrl.split(".").pop(); 
      const fullFileName = `${fileName}.${fileExtension}`;

      // 🔹 Create a Blob object from the response
      const blob = new Blob([response.data]);

      // 🔹 Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // 🔹 Create an <a> tag to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = fullFileName; // File with correct extension
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 🔹 Revoke the blob URL to free memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("🔥 Error downloading file:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* 🔹 Course Selection */}
      {!selectedCourse ? (
        <>
          <h2 className="text-xl font-bold mb-2">Select a Course</h2>
          <div className="grid grid-cols-2 gap-4">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <button
                  key={index}
                  className="bg-green text-white p-4 rounded-lg hover:bg-blue-600"
                  onClick={() => setSelectedCourse(course)}
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
                    fetchStudyMaterials(subject);
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
      ) : (
        <>
          {/* 🔹 Study Material List */}
          <h2 className="text-xl font-bold mb-2">Study Materials</h2>
          {studyMaterials.length > 0 ? (
            <div className="space-y-4">
              {studyMaterials.map((material, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border border-gray-300 rounded-lg"
                >
                  <span className="text-lg">{material.title}</span>
                  <div className="space-x-3">
                    <button
                      onClick={() => window.open(material.fileUrl, "_blank")}
                      className="bg-orange text-white p-2 rounded hover:bg-blue-600"
                    >
                      Preview 📄
                    </button>
                    <button
                      onClick={() => handleDownload(material.fileUrl, material.title)}
                      className="bg-green text-white p-2 rounded hover:bg-green-600"
                    >
                      Download ⬇️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No study materials available for this subject.</p>
          )}
        </>
      )}
    </div>
  );
};

// 🔹 Authorization Token Function
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default StudentStudyMaterial;
