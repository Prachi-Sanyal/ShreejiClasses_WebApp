import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [subjects, setSubjects] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedCourse || !studentClass || !subjects || !materialType) {
      setMessage("❌ Please fill all fields and select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);  
    formData.append("selectedCourse", selectedCourse);
    formData.append("studentClass", studentClass);
    formData.append("subjects", subjects);
    formData.append("materialType", materialType);

    try {
      setUploading(true);
      setMessage("");

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Upload Successful:", response.data);
      setMessage("✅ File uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload Error:", error.response ? error.response.data : error.message);
      setMessage("❌ Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>📂 Upload Study Material</h2>

      <label>📚 Selected Course:</label>
      <input type="text" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} />

      <label>🏫 Student Class:</label>
      <input type="text" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} />

      <label>📖 Subjects:</label>
      <input type="text" value={subjects} onChange={(e) => setSubjects(e.target.value)} />

      <label>📂 Material Type:</label>
      <input type="text" value={materialType} onChange={(e) => setMaterialType(e.target.value)} />

      <label>📎 Upload File:</label>
      <input type="file" onChange={handleFileChange} />

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
