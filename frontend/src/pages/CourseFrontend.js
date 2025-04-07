import { useNavigate } from "react-router-dom"; 
import React, { useState, useEffect } from "react"; 
import axios from "axios"; 
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { ArrowRightCircle } from "lucide-react"; 

const CourseFrontend = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/front/coursefrontend`);
        setCourses(response.data);
      } catch (error) {
        toast.error("Error fetching courses.");
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen ml-20 mr-20">
      <h1 className="text-3xl font-bold text-center mb-6 mt-36 text-gray-800">Our Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-pink-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition duration-300 flex flex-col min-h-[500px]"
          >
            <img
              src={course.imageUrl}
              alt={course.category}
              className="w-full h-48 object-cover"
            />

            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-gray-900">{course.category}</h3>
              <p className="text-gray-700 mt-2 line-clamp-3">{course.description}</p>
              <p className="mt-2 text-gray-600"><strong>Weekly Tests:</strong> {course.weeklyTests ? 'Yes' : 'No'}</p>
              <p className="mt-2 text-gray-600 flex-grow"><strong>Additional Details:</strong> {course.additionalDetails}</p>

              <div className="mt-auto">
                <button
                  onClick={() => navigate(`/coursedetails/${course._id}`)} 
                  className="w-full bg-orange text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition duration-300"
                >
                  View Details <ArrowRightCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default CourseFrontend;
