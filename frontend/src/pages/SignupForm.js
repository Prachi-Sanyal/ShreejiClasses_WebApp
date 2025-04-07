import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import signupImage from "../assets/img/signup.jpg"; 

const classOptions = ["6", "7", "8", "9", "10", "11", "12", "Others"];
const courseOptions = [
  "Grade 6-10",
  "Grade 11-12 Science",
  "JEE/NEET/GUJCET Preparation",
  "SOF Olympiad",
];
const studentSubjectsOptions = {
  "Grade 6-10": ["Maths", "Science", "English", "Social Science"],
  "Grade 11-12 Science": ["Physics", "Chemistry", "Maths", "Biology"],
  "JEE/NEET/GUJCET Preparation": ["Physics", "Chemistry", "Maths", "Biology"],
  "SOF Olympiad": ["Maths", "Science"],
};
const teacherSubjectsOptions = {
  "Grade 6-10": ["Maths", "Science", "English", "Social Science"],
  "Grade 11-12 Science": ["Physics", "Chemistry", "Maths", "Biology"],
  "JEE/NEET/GUJCET Preparation": ["Physics", "Chemistry", "Maths", "Biology"],
  "SOF Olympiad": ["Maths", "Science"],
};

const restrictedCourses = ["Grade 11-12 Science", "JEE/NEET/GUJCET Preparation"];

const SignupForm = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    contactNumber: "",
    parentContactNumber: "",
    studentClass: "",
    selectedCourse: [],
    subjects: [],
    teachesClass: [],
    taughtCourses: [{}],
    teacherSubjects: [{}], 
    password: "",
  });
  const [subjectOptions, setSubjectOptions] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (name === "studentClass" && restrictedCourses.some((course) => formData.selectedCourse.includes(course))) {
      setFormData({ ...formData, [name]: value, selectedCourse: [] });
      toast.info("Restricted courses deselected due to class change.");
      return;
    }

    setFormData({ ...formData, [name]: value });

    if (type === "select-multiple" && selectedOptions) {
      const selectedValues = Array.from(selectedOptions, option => option.value);
      setFormData({ ...formData, [name]: selectedValues });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  

  if (type === "checkbox") {
    setFormData((prevData) => {
      const updatedSubjects = selectedOptions
        ? [...prevData.teacherSubjects, value]
        : prevData.teacherSubjects.filter((subject) => subject !== value);
      return { ...prevData, teacherSubjects: updatedSubjects };
    });
  } else {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }
};

  const handleCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target;

    if (
      formData.role === "student" &&
      fieldName === "selectedCourse" &&
      restrictedCourses.includes(value)
    ) {
      if (formData.studentClass >= "6" && formData.studentClass <= "10") {
        toast.error("You cannot select this course as it is not suitable for your class!");
        return;
      }
    }

    setFormData((prevData) => {
      const updatedSubjects = checked
        ? [...prevData.teacherSubjects, value]  
        : prevData.teacherSubjects.filter((subject) => subject !== value); 
      return { ...prevData, teacherSubjects: updatedSubjects };
    });

    if (
      formData.role === "teacher" &&
      fieldName === "taughtCourses" &&
      restrictedCourses.includes(value)
    ) {
      const isTeachingRestrictedClasses = formData.teachesClass.every(
        (cls) => cls >= "6" && cls <= "10"
      );
      if (isTeachingRestrictedClasses) {
        toast.error("You cannot select this course as it does not match the classes you teach!");
        return;
      }
    }

    setFormData((prevData) => {
      const updatedArray = checked
        ? [...prevData[fieldName], value]
        : prevData[fieldName].filter((item) => item !== value);
      return { ...prevData, [fieldName]: updatedArray };
    });
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/checkEmail/check-email`, { email });
      return response.data.exists;  
    } catch (error) {
      console.error("Error checking email existence:", error);
      toast.error("Unable to check email existence. Please try again.");
      return false;  
    }
  };
  
  const nextStep = async () => {
    const { name, email, role } = formData;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!name || !email || !role) {
      toast.error("Please fill all fields.");
      return;  
    }
  
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email.");
      return;  
    }

    
  
  
    try {
      const emailExists = await checkEmailExists(email);
  
      if (emailExists) {
        toast.error("This email is already registered.");
        return;  
      }
  
      setStep(2);
  
    } catch (error) {
      console.error("Error during email validation:", error);
      toast.error("An error occurred while validating the email. Please try again.");
    }
  };
    const prevStep = () => {
    setStep(1);
  };

  useEffect(() => {
    if (formData.role === "student" && formData.selectedCourse.length > 0) {
      const selectedSubjects = new Set();
      formData.selectedCourse.forEach((course) => {
        const subjectsForCourse = studentSubjectsOptions[course] || [];
        subjectsForCourse.forEach(subject => selectedSubjects.add(subject));
      });
      setSubjectOptions([...selectedSubjects]);
    } else if (formData.role === "teacher" && formData.taughtCourses.length > 0) {
      const teacherSubjects = new Set();
      formData.taughtCourses.forEach((course) => {
        const subjectsForCourse = teacherSubjectsOptions[course] || [];
        subjectsForCourse.forEach(subject => teacherSubjects.add(subject));
      });
      setSubjectOptions([...teacherSubjects]);
    }
  }, [formData.selectedCourse, formData.taughtCourses, formData.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(formData)

    let payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      contactNumber: formData.contactNumber,
    };

    if (formData.role === "student") {
      payload = {
        ...payload,
        parentContactNumber: formData.parentContactNumber,
        studentClass: [formData.studentClass],
        selectedCourse: formData.selectedCourse,
        subjects: formData.subjects,
      };
    } else if (formData.role === "teacher") {
      payload.teachesClass = formData.teachesClass;
      payload.taughtCourses = formData.taughtCourses.map(course => ({
        course: course.course,
        subjects: course.subjects,
      }));
      payload.teacherSubjects = formData.teacherSubjects.map(subject => ({
        subject: subject.subject,
      }));
      
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, payload,{
        headers:{
          "Content-Type":"application/json"
        },
      }
      );
      toast.success("Signup successful! OTP sent to your email.");
      setTimeout(() => {
        navigate("/verifyOtp", { state: { email: formData.email } });
      }, 2000);
    } catch (error) {
      console.error("submit error ",error)
      if (error.response) {
        console.error("Error Response:", error.response.data);
        console.error("Status Code:", error.response.status);}
      toast.error("Signup failed! Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-20 ml-12 mr-12">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-md flex">
        {/* Left Side Image */}
        <div className="hidden md:flex w-1/2">
          <img
            src={signupImage}
            alt="Signup"
            className="object-cover w-full h-full rounded-l-lg"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Signup
          </h2>
       
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              <button
                type="button"
                onClick={nextStep}
                className="w-full py-2 bg-orange text-white"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
              {formData.role === "student" && (
                <>
                  <input
                    type="text"
                    name="parentContactNumber"
                    placeholder="Parent Contact Number"
                    value={formData.parentContactNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <select
                    name="studentClass"
                    value={formData.studentClass}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="">Select Class</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>

                  <div className="mt-4">
                    <label className="block mb-2">Select Courses:</label>
                    {courseOptions.map((course) => (
                      <label key={course} className="inline-flex items-center mr-6">
                        <input
                          type="checkbox"
                          value={course}
                          checked={formData.selectedCourse.includes(course)}
                          onChange={(e) => handleCheckboxChange(e, "selectedCourse")}
                          className="form-checkbox"
                          
                        />
                        <span className="ml-2">{course}</span>
                      </label>
                    ))}
                  </div>

                  {formData.selectedCourse.length > 0 && (
                    <div className="mt-4">
                      <label className="block mb-2">Select Subjects:</label>
                      {subjectOptions.map((subject) => (
                        <label key={subject} className="inline-flex items-center mr-6">
                          <input
                            type="checkbox"
                            value={subject}
                            checked={formData.subjects.includes(subject)}
                            onChange={(e) => handleCheckboxChange(e, "subjects")}
                            className="form-checkbox"
                            
                          />
                          <span className="ml-2">{subject}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </>
              )}

{formData.role === "teacher" && (
  <>
    <div className="mt-4">
      <label className="block mb-2">Teaches Class:</label>
      {classOptions.map((cls) => (
        <label key={cls} className="inline-flex items-center mr-6">
          <input
            type="checkbox"
            value={cls}
            checked={formData.teachesClass.includes(cls)}
            onChange={(e) => handleCheckboxChange(e, "teachesClass")}
            className="form-checkbox"
          />
          <span className="ml-2">{cls}</span>
        </label>
      ))}
    </div>

    <div className="mt-4">
      <label className="block mb-2">Taught Courses:</label>
      {courseOptions.map((course) => (
        <label key={course} className="inline-flex items-center mr-6">
          <input
            type="checkbox"
            value={course}
            checked={formData.taughtCourses.includes(course)}
            onChange={(e) => handleCheckboxChange(e, "taughtCourses")}
            className="form-checkbox"
          />
          <span className="ml-2">{course}</span>
        </label>
      ))}
    </div>

    {formData.taughtCourses.length > 0 && (
      <div className="mt-4">
        <label className="block mb-2">Select Subjects:</label>
        {subjectOptions.map((subject) => (
          <label key={subject} className="inline-flex items-center mr-6">
            <input
              type="checkbox"
              value={subject}
              checked={formData.subjects.includes(subject)}
              onChange={(e) => handleCheckboxChange(e, "subjects")}
              className="form-checkbox"
            />
            <span className="ml-2">{subject}</span>
          </label>
        ))}
      </div>
    )}
  </>
)}


              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
              <button
                type="submit"
                className="w-full py-2 bg-orange text-white"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={prevStep}
                className="w-full py-2 border rounded-md"
              >
                Back
              </button>
            </>
          )}
        </form>
      </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignupForm;
