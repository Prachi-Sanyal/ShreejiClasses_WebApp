import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlusCircle } from 'react-icons/fa';
import { FaEdit, FaTrash } from "react-icons/fa"; 


const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [courseCategory, setCourseCategory] = useState("");
  const [courseBoard, setCourseBoard] = useState([]);
  const [courseSubjects, setCourseSubjects] = useState([]);
  const [courseDuration, setCourseDuration] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseHighlights, setCourseHighlights] = useState([]);
  const [courseWeeklyTests, setCourseWeeklyTests] = useState(false);  
  const [courseImage, setCourseImage] = useState(null);  
  const [courseAdditionalDetails, setCourseAdditionalDetails] = useState(""); 
  const [editCourse, setEditCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/courses`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCourses(response.data);
      } catch (error) {
        toast.dismiss();  

        toast.error("Error fetching courses.", {
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
        });      }
    };

    fetchCourses();
  }, []);

  const addCourse = async () => {
    if (!courseCategory || !courseDescription) {
      toast.dismiss();
      toast.error("Please fill in all fields.", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }
  
    const courseData = new FormData();
    courseData.append("category", courseCategory);
    courseData.append("board", courseBoard);
    courseData.append("subjects", courseSubjects);
    courseData.append("duration", courseDuration);
    courseData.append("description", courseDescription);
    courseData.append("highlights", courseHighlights);
    courseData.append("weeklyTests", courseWeeklyTests);
    courseData.append("image", courseImage);  
    courseData.append("additionalDetails", courseAdditionalDetails);
  
    
    for (let [key, value] of courseData.entries()) {
      console.log(key, value);
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/courses`,
        courseData,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCourses([...courses, response.data]);
      toast.dismiss();
      toast.success("Course added successfully!", { toastId: "add_success" });
      resetForm();
    } catch (error) {
      console.error("Error from backend:", error.response);  
      toast.dismiss();
      toast.error("Error adding course.", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };
  

  const resetForm = () => {
    setCourseCategory("");
    setCourseBoard([]);
    setCourseSubjects([]);
    setCourseDuration("");
    setCourseDescription("");
    setCourseHighlights([]);
    setCourseWeeklyTests(false);
    setCourseImage(null);
    setCourseAdditionalDetails("");
    setEditCourse(null);
    setShowForm(false);
  };

  const updateCourse = async () => {
    if (!courseCategory || !courseDescription) {
      toast.dismiss();  

      toast.error("Please fill in all fields.", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });      return;
    }

    const courseData = {
      category: courseCategory,
      board: courseBoard,
      subjects: courseSubjects,
      duration: courseDuration,
      description: courseDescription,
      highlights: courseHighlights,
      weeklyTests: courseWeeklyTests || false,
      imageUrl: courseImage || '',
      additionalDetails: courseAdditionalDetails || ''
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/courses/${editCourse._id}`,
        courseData,
        { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
      );
      const updatedCourses = courses.map(course =>
        course._id === editCourse._id ? response.data : course
      );
      setCourses(updatedCourses);
      toast.dismiss();  

      toast.success("Course updated successfully!", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
       toastId: "edit_success" 
      });      resetForm();
    } catch (error) {
      toast.dismiss();  

      toast.error("Error updating course.", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${id}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      setCourses(courses.filter(course => course._id !== id));
      toast.dismiss();  

      toast.success("Course deleted successfully!", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
       toastId: "delete_success" 
            
      });    } catch (error) {
        toast.dismiss();  

        toast.error("Error deleting course.", {
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
        });    }
  };

  

  const renderCourses = () => {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-orange text-white rounded mb-6 flex items-center"
        >
          <FaPlusCircle className="mr-2" /> Add Course
        </button>

        {showForm && (
          <div className="card p-4 mb-6 border rounded shadow-md">
            <input
              type="text"
              value={courseCategory}
              onChange={(e) => setCourseCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-2"
              placeholder="Course Category"
            />
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
              placeholder="Course Description"
            />
            <input
              type="text"
              value={courseDuration}
              onChange={(e) => setCourseDuration(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-2"
              placeholder="Course Duration"
            />
            <textarea
              value={courseHighlights}
              onChange={(e) => setCourseHighlights(e.target.value.split(","))}
              className="w-full px-3 py-2 border rounded mb-4"
              placeholder="Course Highlights (comma separated)"
            />
            
            <label>
              Weekly Tests:
              <input
                type="checkbox"
                checked={courseWeeklyTests}
                onChange={(e) => setCourseWeeklyTests(e.target.checked)}
              />
            </label>
            <input
              type="file"
              onChange={(e) => setCourseImage(e.target.files[0])}  
              className="w-full px-3 py-2 border rounded mb-2"
            />
            <textarea
              value={courseAdditionalDetails}
              onChange={(e) => setCourseAdditionalDetails(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
              placeholder="Additional Details"
            />
            <button
              onClick={editCourse ? updateCourse : addCourse}
              className="px-4 py-2 bg-green text-white rounded"
            >
              {editCourse ? "Update Course" : "Add Course"}
            </button>
          </div>
        )}

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {courses.map((course) => (
    <div key={course._id} className="card p-4 border rounded shadow-md">
      <img
  src={course.imageUrl}  
        alt={course.category}   
        className="w-full h-40 object-cover rounded mb-4"  
      />
      <h3 className="text-xl font-semibold">{course.category}</h3>
      <p>{course.description}</p>
      
      <p><strong>Weekly Tests:</strong> {course.weeklyTests ? 'Yes' : 'No'}</p>
      <p><strong>Additional Details:</strong> {course.additionalDetails}</p>
      <div className="mt-2 flex items-center gap-4">
        <button
          onClick={() => {
            setEditCourse(course);
            setCourseCategory(course.category);
            setCourseBoard(course.board);
            setCourseSubjects(course.subjects);
            setCourseDuration(course.duration);
            setCourseDescription(course.description);
            setCourseHighlights(course.highlights.join(", "));
            setCourseWeeklyTests(course.weeklyTests);
            setCourseImage(course.imageUrl);  
            setCourseAdditionalDetails(course.additionalDetails);
            setShowForm(true);
          }}
          className="bg-green text-white flex items-center gap-2 px-4 py-2 rounded mb-2"
        >
        <FaEdit />  Edit
        </button>
        <button
          onClick={() => deleteCourse(course._id)}
          className="bg-orange text-white flex items-center gap-2 px-4 py-2 rounded"
          
        >
         <FaTrash />  Delete
        </button>
      </div>
    </div>
  ))}
</div>

        <ToastContainer />
      </div>
    );
  };

  return (
    <div>
      {renderCourses()}
      <ToastContainer />
    </div>
  );
};

export default Courses;
