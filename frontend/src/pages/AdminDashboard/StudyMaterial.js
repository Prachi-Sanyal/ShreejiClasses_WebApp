import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/materials`);
      const data = await res.json();
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !category || !file) {
      setMessage("Please fill all fields and select a file.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/materials/add`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Upload successful!");
        setTitle("");
        setCategory("");
        setFile(null);
        fetchMaterials(); 
      } else {
        setMessage(data.error || "Upload failed. Try again.");
      }
    } catch (error) {
      setMessage("Error uploading file. Please try again.");
    }

    setUploading(false);
  };

  return (
    <div>
      <h2>Study Materials</h2>

      <button onClick={() => setShowUploadForm(!showUploadForm)}>
        {showUploadForm ? "Hide Upload Form" : "Upload Study Material"}
      </button>

      {showUploadForm && (
        <div>
          <h3>Upload Study Material</h3>
          <form onSubmit={handleUpload}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Category (e.g., Math, Science)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input type="file" onChange={handleFileChange} required />
            <button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}

      {materials.length === 0 ? (
        <p>No materials available</p>
      ) : (
        <ul>
          {materials.map((item) => (
            <li key={item._id}>
              <strong>{item.title}</strong> ({item.category})  
              <br />
              <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudyMaterials;
