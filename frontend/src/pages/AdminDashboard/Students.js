import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaPhoneAlt, FaBook, FaClipboardList, FaRegBuilding } from 'react-icons/fa';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/students`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data); 
    setStudents(response.data.students); 
    setIsLoading(false); 
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Error fetching students.");
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleEdit = (student) => {
    setIsEditing(true);
    setEditedStudent({ ...student }); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to save the changes?')) {
      try {
        console.log('Submitting updated student:', editedStudent);  
  
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/users/${editedStudent._id}`,
          editedStudent,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        console.log('Server response:', response.data); 
  
        toast.success('Student details updated successfully!');
        
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === editedStudent._id ? { ...student, ...editedStudent } : student
          )
        );
        setIsEditing(false); 
      } catch (error) {
        console.error('Error updating student details:', error.response || error);
        toast.error('Error updating student details');
      }
    }
  };
  


  

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/users/${studentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStudents(students.filter((student) => student._id !== studentId));
        toast.success("Student deleted successfully!");
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Error deleting student.");
      }
    }
  };

  

  const renderStudents = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (!students.length) {
      return <div>No students found.</div>;
    }
  
    
    
      return (
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold mb-6">Manage Students</h1>
          <div className="space-y-6">
            {students.map((student) => (
              <div key={student._id} className="bg-white p-4 rounded-lg shadow-lg space-y-4">
                {isEditing && editedStudent._id === student._id ? (
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-blue-500" />
                      <span className="font-semibold">Name:</span>
                      <input
                        type="text"
                        name="name"
                        value={editedStudent.name}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-full"
                      />
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="text-green-500" />
                      <span className="font-semibold">Email:</span>
                      <input
                        type="email"
                        name="email"
                        value={editedStudent.email}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-full"
                      />
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaPhoneAlt className="text-teal-500" />
                      <span className="font-semibold">Contact Number:</span>
                      <input
                        type="text"
                        name="contactNumber"
                        value={editedStudent.contactNumber}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-full"
                      />
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaPhoneAlt className="text-teal-500" />
                      <span className="font-semibold">Parent's Contact Number:</span>
                      <input
                        type="text"
                        name="parentContactNumber"
                        value={editedStudent.parentContactNumber}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-full"
                      />
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaClipboardList className="text-yellow-500" />
                      <span className="font-semibold">Class:</span>
                      <input
                        type="text"
                        name="studentClass"
                        value={editedStudent.studentClass}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-full"
                      />
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaRegBuilding className="text-purple-500" />
                      <span className="font-semibold">Selected Course:</span>
                      <input
                        type="text"
                        name="selectedCourse"
                        value={editedStudent.selectedCourse.join(' ')}
                        onChange={(e) => {
                          const courses = e.target.value.split(' ');
                          setEditedStudent((prev) => ({
                            ...prev,
                            selectedCourse: courses,
                          }));
                        }}
                        className="border rounded-md p-2 w-full"
                      />
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaBook className="text-red-500" />
                      <span className="font-semibold">Subjects:</span>
                      <input
                        type="text"
                        name="subjects"
                        value={editedStudent.subjects.join(', ')}
                        onChange={(e) => {
                          const subjects = e.target.value.split(', ');
                          setEditedStudent((prev) => ({
                            ...prev,
                            subjects,
                          }));
                        }}
                        className="border rounded-md p-2 w-full"
                      />
                    </div>
    
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={handleSubmit}
                        className="bg-green text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Submit Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-orange text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-blue-500" />
                      <span className="font-semibold">Name:</span>
                      <p>{student.name}</p>
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="text-green-500" />
                      <span className="font-semibold">Email:</span>
                      <p>{student.email}</p>
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaPhoneAlt className="text-teal-500" />
                      <span className="font-semibold">Contact Number:</span>
                      <p>{student.contactNumber}</p>
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaPhoneAlt className="text-teal-500" />
                      <span className="font-semibold">Parent's Contact Number:</span>
                      <p>{student.parentContactNumber}</p>
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaClipboardList className="text-yellow-500" />
                      <span className="font-semibold">Class:</span>
                      <p>{student.studentClass}</p>
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaRegBuilding className="text-purple-500" />
                      <span className="font-semibold">Selected Course:</span>
                      <p>{student.selectedCourse.join(' ')}</p>
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaBook className="text-red-500" />
                      <span className="font-semibold">Subjects:</span>
                      <p>{student.subjects.join(', ')}</p>
                    </div>
    
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={() => handleEdit(student)}
                        className="bg-green text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-orange text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };
    

  return (
    <div>
      {renderStudents()}
      <ToastContainer />
    </div>
  );
};

export default Students;
