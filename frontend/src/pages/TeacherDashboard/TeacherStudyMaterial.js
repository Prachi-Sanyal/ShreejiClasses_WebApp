import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherStudyMaterial = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [course, setCourse] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      if (!token) {
        toast.error("Token not found");
        return;
      }
      const decodedToken = jwtDecode(token);
      const teacherId = decodedToken.userId || decodedToken.id || decodedToken._id;

      if (!teacherId) {
        toast.error("Teacher ID not found in token");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/materials/teacher/${teacherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaterials(response.data.materials);
    } catch (error) {
      toast.error(`Error fetching materials: ${error.response?.data || error.message}`);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !category || !course || !className || !subject || !file) {
      return toast.warning("Please fill all fields!");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("selectedCourse", course);
    formData.append("subjects", subject);
    formData.append("studentClass", className);


    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/materials/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Material uploaded successfully!");
      fetchMaterials();
      setTitle("");
      setCategory("");
      setCourse("");
      setClassName("");
      setSubject("");
      setFile(null);
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Material deleted successfully!");
      fetchMaterials();
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Teacher Dashboard</h2>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Material Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Notes">Notes</option>
          <option value="Assignment">Assignment</option>
        </select>

        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Course</option>
          <option value="Grade 6-10">Grade 6-10</option>
          <option value="Grade 11-12 Science">Grade 11-12 Science</option>
          <option value="JEE/NEET/GUJCET Preparation">JEE/NEET/GUJCET Preparation</option>
          <option value="SOF Olympiad Preparation">SOF Olympiad Preparation</option>
        </select>

        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Class</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="GUJCET/NEET/JEE Preparation">GUJCET/NEET/JEE Preparation</option>
          <option value="SOF Olympiad Preparation">SOF Olympiad Preparation</option>
        </select>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Subject</option>
          <option value="Maths">Maths</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
          <option value="Social Science">Social Science</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
        </select>

        <input
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Material"}
        </button>
      </form>

      {/* Uploaded Materials List */}
      <h3 className="text-xl font-semibold mb-3">Your Uploaded Materials</h3>
      <div>
        {materials.length === 0 ? (
          <p>No materials uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {materials.map((material) => (
              <li key={material._id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{material.title}</p>
                  <p className="text-sm text-gray-600">
                    {material.category} - {material.course} - {material.className} - {material.subject}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View
                  </a>
                  <button onClick={() => handleDelete(material._id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeacherStudyMaterial;
