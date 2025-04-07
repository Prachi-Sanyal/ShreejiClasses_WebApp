import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaPhoneAlt, FaBook, FaClipboardList, FaRegBuilding } from 'react-icons/fa';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState(null);


  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/teachers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data); 
    setTeachers(response.data.teachers); 
    setIsLoading(false); 
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Error fetching students.");
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleEdit = (teacher) => {
    setIsEditing(true);
    setEditedTeacher({ ...teacher }); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to save the changes?')) {
      try {
        console.log('Submitting updated student:', editedTeacher);  
  
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/users/${editedTeacher._id}`,
          editedTeacher,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        console.log('Server response:', response.data); 
  
        toast.success('Student details updated successfully!');
        
        setTeachers((prevTeachers) =>
            prevTeachers.map((teacher) =>
              teacher._id === editedTeacher._id ? { ...teacher, ...editedTeacher } : teacher
            )
          );
        setIsEditing(false); 
      } catch (error) {
        console.error('Error updating teacher details:', error.response || error);
        toast.error('Error updating teacher details');
      }
    }
  };
  


  

  const handleDelete = async (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/users/${teacherId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTeachers(teachers.filter((teacher) => teacher._id !== teacherId));
        toast.success("Teacher deleted successfully!");
      } catch (error) {
        console.error("Error deleting teacher:", error);
        toast.error("Error deleting teacher.");
      }
    }
  };

  

  const renderTeachers = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (!teachers.length) {
        return <div>No teachers found.</div>;
      }
  
    
    
      return (
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold mb-6">Manage Teachers</h1>
          <div className="space-y-6">
            {teachers.map((teacher) => (
              <div key={teacher._id} className="bg-white p-4 rounded-lg shadow-lg space-y-4">
                {isEditing && editedTeacher._id === teacher._id ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-blue-500" />
                      <span className="font-semibold">Name:</span>
                      <input
                        type="text"
                        name="name"
                        value={editedTeacher.name}
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
                        value={editedTeacher.email}
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
                        value={editedTeacher.contactNumber}
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
                        value={editedTeacher.teachesClass.join(', ')}  
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
                        value={editedTeacher.taughtCourses.join(', ')}
                        onChange={(e) => {
                          const courses = e.target.value.split(' ');
                          setEditedTeacher((prev) => ({
                            ...prev,
                            taughtCourses: courses,
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
                        value={editedTeacher.teacherSubjects.join(', ')}
                        onChange={(e) => {
                          const subjects = e.target.value.split(', ');
                          setEditedTeacher((prev) => ({
                            ...prev,
                            teacherSubjects: subjects, 
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
                      <p>{teacher.name}</p>
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="text-green-500" />
                      <span className="font-semibold">Email:</span>
                      <p>{teacher.email}</p>
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaPhoneAlt className="text-teal-500" />
                      <span className="font-semibold">Contact Number:</span>
                      <p>{teacher.contactNumber}</p>
                    </div>
    
                    
                    <div className="flex items-center space-x-2">
                      <FaClipboardList className="text-yellow-500" />
                      <span className="font-semibold">Teaches Class:</span>
                      <p>{teacher.teachesClass.join(', ')}</p>
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <FaRegBuilding className="text-purple-500" />
                      <span className="font-semibold">Teaches Course:</span>
                    {/*  <p>{teacher.taughtCourses.join(', ')}</p>  */}
                    <p>{teacher.taughtCourses.map(course => course.course).join(', ')}</p> {/* Correctly display course names */}

                      </div>
    
                    <div className="flex items-center space-x-2">
                      <FaBook className="text-red-500" />
                      <span className="font-semibold">Subjects:</span>
                    {/*  <p>{teacher.teacherSubjects.length > 0 ? teacher.teacherSubjects.join(', ') : 'No subjects assigned'}</p>  */}
                    <p>{teacher.teacherSubjects.length > 0 ? teacher.teacherSubjects.map(subject => subject.subject).join(', ') : 'No subjects assigned'}</p> {/* Correctly display subjects */}

                      </div>
    
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="bg-green text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(teacher._id)}
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
      {renderTeachers()}
      <ToastContainer />
    </div>
  );
};

export default Teachers;
