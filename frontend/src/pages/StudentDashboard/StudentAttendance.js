
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import c2 from '../../assets/img/courses/science.png';
import c1 from '../../assets/img/courses/grade6-10.png';
import c3 from '../../assets/img/courses/exam.jpg';
import c4 from '../../assets/img/courses/olympiad.jpg';

import physics from '../../assets/img/blogs/1.jpg';
import biology from '../../assets/img/blogs/2.jpg';
import chemistry from '../../assets/img/blogs/chemistry.jpeg';
import maths from '../../assets/img/blogs/maths.jpeg';
import science from '../../assets/img/blogs/science.jpeg';
import english from '../../assets/img/blogs/english.jpg';
import socialscience from '../../assets/img/blogs/socialscience.jpeg';


const StudentAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/attendance/student-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.attendanceCourses) {
          setCourses(res.data.attendanceCourses);
        } else {
          console.error("Invalid API response:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const fetchAttendance = (course, subject) => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/attendance/student-records?month=${month}&year=${year}&subject=${subject}&course=${course}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setAttendance(res.data);
        setSelectedCourse(course);
        setSelectedSubject(subject);
      })
      .catch((err) => console.error("Error fetching attendance:", err))
      .finally(() => setLoading(false));
  };

  const daysInMonth = () => {
    const days = [];
    const totalDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    for (let i = 1; i <= totalDays; i++) {
      days.push(moment(`${year}-${month}-${i}`, "YYYY-MM-DD"));
    }
    return days;
  };

  const isSunday = (date) => moment(date).day() === 0;

  const getStatus = (date) => {
    const record = attendance.find((att) =>
      moment(att.date).isSame(moment(date), "day")
    );
    return record ? record.status : "N/A";
  };

  const totalClasses = attendance.filter((att) => att.status !== "N/A").length;
  const presentDays = attendance.filter((att) => att.status === "Present").length;
  const absentDays = attendance.filter((att) => att.status === "Absent").length;

  const data = [
    { name: "Present", value: presentDays, color: "#4CAF50" },
    { name: "Absent", value: absentDays, color: "#F44336" },
  ];

  const updateMonthYear = (direction) => {
    if (direction === "previous") {
      setMonth(month === 1 ? 12 : month - 1);
      if (month === 1) setYear(year - 1);
    } else {
      setMonth(month === 12 ? 1 : month + 1);
      if (month === 12) setYear(year + 1);
    }
    // Refetch attendance data after month change
    if (selectedCourse && selectedSubject) {
      fetchAttendance(selectedCourse, selectedSubject);
    }
  };


  const getCourseImagePath = (course) => {
    switch (course) {
      case "Grade 11-12 Science":
        return c2;
      case "Grade 6-10":
        return c1;
      case "GUJCET/NEET/JEE":
        return c3;
      case "SOF Olympiad":
        return c4;
      default:
        return "/images/courses/default.jpg"; // fallback image
    }
  };

  const getSubjectImagePath = (subject) => {
    switch (subject) {
      case "Physics":
        return physics;
      case "Maths":
        return maths;
      case "Chemistry":
        return chemistry;
      case "Biology":
        return biology;
      case "Science":
        return science;
      case "English":
        return english;
      case "Social Science":
          return socialscience;
      default:
        return "/images/subjects/default.jpg"; // fallback image
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-700 mb-4">Attendance Records</h1>

      {!selectedCourse ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course._id.course}
                className="p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedCourse(course._id.course)}
              >
                <img
                  src={getCourseImagePath(course._id.course)} // Dynamic image path for courses
                  alt={course._id.course}
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{course._id.course}</h3>
                  <p className="text-sm text-gray-500">Class: {course._id.class}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !selectedSubject ? (
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Choose Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses
              .find((c) => c._id.course === selectedCourse)
              ?.subjects.map((subject) => (
                <div
                  key={subject}
                  className="p-6 bg-blue-100 shadow-lg rounded-lg cursor-pointer hover:bg-blue-200 transition relative"
                  onClick={() => fetchAttendance(selectedCourse, subject)}
                >
                  <img
                     src={getSubjectImagePath(subject)} // Dynamic image path for subjects
                     alt={subject}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <h3 className="mt-3 text-md font-semibold text-blue-800">{subject}</h3>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Attendance Summary</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-lg">
              <p>Total Classes: <span className="font-semibold">{totalClasses}</span></p>
              <p>Present Days: <span className="font-semibold text-green-600">{presentDays}</span></p>
              <p>Absent Days: <span className="font-semibold text-red-600">{absentDays}</span></p>
            </div>
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} label>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => updateMonthYear("previous")}
              className="px-4 py-2 bg-gray-200 rounded text-lg"
            >
              {"<"}
            </button>
            <h2 className="text-lg font-bold">
              {moment(`${year}-${month}`, "YYYY-MM").format("MMMM YYYY")}
            </h2>
            <button
              onClick={() => updateMonthYear("next")}
              className="px-4 py-2 bg-gray-200 rounded text-lg"
            >
              {">"}
            </button>
          </div>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-3 py-2">Date</th>
                <th className="border border-gray-300 px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {daysInMonth().map((date) => {
                const status = getStatus(date);
                return (
                  <tr key={date.format("YYYY-MM-DD")}>
                    <td className="border border-gray-300 px-3 py-2">
                      {date.format("DD MMM YYYY")}
                    </td>
                    <td
                      className="border border-gray-300 px-3 py-2"
                      style={{
                        color:
                          status === "Present"
                            ? "#4CAF50"
                            : status === "Absent"
                            ? "#F44336"
                            : "rgba(0, 0, 0, 0.3)",
                        fontWeight: status !== "N/A" ? "bold" : "normal",
                        backgroundColor: "transparent",
                      }}
                    >
                      {loading ? "Loading..." : status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button
            onClick={() => setSelectedSubject(null)}
            className="mt-4 px-4 py-2 bg-orange text-white rounded-md"
          >
            Back to Subjects
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;










{/*

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const StudentAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/attendance/student-courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.attendanceCourses) {
          setCourses(res.data.attendanceCourses);
        } else {
          console.error("Invalid API response:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const fetchAttendance = (course, subject) => {
    setLoading(true);
    axios
      .get(
        `http://localhost:5000/api/attendance/student-records?month=${month}&year=${year}&subject=${subject}&course=${course}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setAttendance(res.data);
        setSelectedCourse(course);
        setSelectedSubject(subject);
      })
      .catch((err) => console.error("Error fetching attendance:", err))
      .finally(() => setLoading(false));
  };

  const daysInMonth = () => {
    const days = [];
    const totalDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    for (let i = 1; i <= totalDays; i++) {
      days.push(moment(`${year}-${month}-${i}`, "YYYY-MM-DD"));
    }
    return days;
  };

  const isSunday = (date) => moment(date).day() === 0;

  const getStatus = (date) => {
    const record = attendance.find((att) =>
      moment(att.date).isSame(moment(date), "day")
    );
    return record ? record.status : "N/A";
  };

  const totalClasses = attendance.filter((att) => att.status !== "N/A").length;
  const presentDays = attendance.filter((att) => att.status === "Present").length;
  const absentDays = attendance.filter((att) => att.status === "Absent").length;

  const data = [
    { name: "Present", value: presentDays, color: "#4CAF50" },
    { name: "Absent", value: absentDays, color: "#F44336" },
  ];

  const updateMonthYear = (direction) => {
    if (direction === "previous") {
      setMonth(month === 1 ? 12 : month - 1);
      if (month === 1) setYear(year - 1);
    } else {
      setMonth(month === 12 ? 1 : month + 1);
      if (month === 12) setYear(year + 1);
    }
    // Refetch attendance data after month change
    if (selectedCourse && selectedSubject) {
      fetchAttendance(selectedCourse, selectedSubject);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-700 mb-4">Attendance Records</h1>

      {!selectedCourse ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course._id.course}
                className="p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedCourse(course._id.course)}
              >
                <img
                  src={`/images/courses/${course._id.course}.jpg`}
                  alt={course._id.course}
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{course._id.course}</h3>
                  <p className="text-sm text-gray-500">Class: {course._id.class}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !selectedSubject ? (
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Choose Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses
              .find((c) => c._id.course === selectedCourse)
              ?.subjects.map((subject) => (
                <div
                  key={subject}
                  className="p-6 bg-blue-100 shadow-lg rounded-lg cursor-pointer hover:bg-blue-200 transition relative"
                  onClick={() => fetchAttendance(selectedCourse, subject)}
                >
                  <img
                    src={`/images/subjects/${subject}.jpg`}
                    alt={subject}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <h3 className="mt-3 text-md font-semibold text-blue-800">{subject}</h3>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Attendance Summary</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-lg">
              <p>Total Classes: <span className="font-semibold">{totalClasses}</span></p>
              <p>Present Days: <span className="font-semibold text-green-600">{presentDays}</span></p>
              <p>Absent Days: <span className="font-semibold text-red-600">{absentDays}</span></p>
            </div>
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} label>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => updateMonthYear("previous")}
              className="px-4 py-2 bg-gray-200 rounded text-lg"
            >
              {"<"}
            </button>
            <h2 className="text-lg font-bold">
              {moment(`${year}-${month}`, "YYYY-MM").format("MMMM YYYY")}
            </h2>
            <button
              onClick={() => updateMonthYear("next")}
              className="px-4 py-2 bg-gray-200 rounded text-lg"
            >
              {">"}
            </button>
          </div>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-3 py-2">Date</th>
                <th className="border border-gray-300 px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {daysInMonth().map((date) => {
                const status = getStatus(date);
                return (
                  <tr key={date.format("YYYY-MM-DD")}>
                    <td className="border border-gray-300 px-3 py-2">
                      {date.format("DD MMM YYYY")}
                    </td>
                    <td
                      className="border border-gray-300 px-3 py-2"
                      style={{
                        color:
                          status === "Present"
                            ? "#4CAF50"
                            : status === "Absent"
                            ? "#F44336"
                            : "rgba(0, 0, 0, 0.3)",
                        fontWeight: status !== "N/A" ? "bold" : "normal",
                        backgroundColor: "transparent",
                      }}
                    >
                      {loading ? "Loading..." : status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button
            onClick={() => setSelectedSubject(null)}
            className="mt-4 px-4 py-2 bg-orange text-white rounded-md"
          >
            Back to Subjects
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;


*/}






{/*

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";


const StudentAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/attendance/student-courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.attendanceCourses) {
          setCourses(res.data.attendanceCourses);
        } else {
          console.error("Invalid API response:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const fetchAttendance = (course, subject) => {
    setLoading(true);
    axios
      .get(
        `http://localhost:5000/api/attendance/student-records?month=${month}&year=${year}&subject=${subject}&course=${course}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setAttendance(res.data);
        setSelectedCourse(course);
        setSelectedSubject(subject);
      })
      .catch((err) => console.error("Error fetching attendance:", err))
      .finally(() => setLoading(false));
  };

  const daysInMonth = () => {
    const days = [];
    const totalDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    for (let i = 1; i <= totalDays; i++) {
      days.push(moment(`${year}-${month}-${i}`, "YYYY-MM-DD"));
    }
    return days;
  };

  const isSunday = (date) => moment(date).day() === 0;

  const getStatus = (date) => {
    const record = attendance.find((att) =>
      moment(att.date).isSame(moment(date), "day")
    );
    return record ? record.status : "N/A";
  };

  const totalClasses = attendance.filter((att) => att.status !== "N/A").length;
  const presentDays = attendance.filter((att) => att.status === "Present").length;
  const absentDays = attendance.filter((att) => att.status === "Absent").length;

  const data = [
    { name: "Present", value: presentDays, color: "#4CAF50" },
    { name: "Absent", value: absentDays, color: "#F44336" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-700 mb-4">
        Attendance Records
      </h1>

      {!selectedCourse ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course._id.course}
              className="p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedCourse(course._id.course)}
            >
             <img
                  src={`/images/courses/${course._id.course}.jpg`}
                  alt={course._id.course}
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{course._id.course}</h3>
                  <p className="text-sm text-gray-500">Class: {course._id.class}</p>
                </div>
            </div>
          ))}
        </div>
        </div>
      ) : !selectedSubject ? (
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Choose Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses
              .find((c) => c._id.course === selectedCourse)
              ?.subjects.map((subject) => (
                <div
                  key={subject}
                  className="p-6 bg-blue-100 shadow-lg rounded-lg cursor-pointer hover:bg-blue-200 transition relative"
                  onClick={() => fetchAttendance(selectedCourse, subject)}
                >
                  <img
                    src={`/images/subjects/${subject}.jpg`}
                    alt={subject}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <h3 className="mt-3 text-md font-semibold text-blue-800">{subject}</h3>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
<h2 className="text-xl font-bold text-gray-700 mb-2">Attendance Summary</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-lg">
              <p>Total Classes: <span className="font-semibold">{totalClasses}</span></p>
              <p>Present Days: <span className="font-semibold text-green-600">{presentDays}</span></p>
              <p>Absent Days: <span className="font-semibold text-red-600">{absentDays}</span></p>
            </div>
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} label>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => {
                setMonth(month === 1 ? 12 : month - 1);
                if (month === 1) setYear(year - 1);
              }}
              className="px-4 py-2 bg-gray-200 rounded text-lg"
            >
              {"<"}
            </button>
            <h2 className="text-lg font-bold">
              {moment(`${year}-${month}`, "YYYY-MM").format("MMMM YYYY")}
            </h2>
            <button
              onClick={() => {
                setMonth(month === 12 ? 1 : month + 1);
                if (month === 12) setYear(year + 1);
              }}
              className="px-4 py-2 bg-gray-200 rounded text-lg"
            >
              {">"}
            </button>
          </div>



          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-3 py-2">Date</th>
                <th className="border border-gray-300 px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
            {daysInMonth().map((date) => {
      const status = getStatus(date);
      return (
        <tr>
          
          <td className="border border-gray-300 px-3 py-2">{date.format("DD MMM YYYY")}</td>
          <td className="border border-gray-300 px-3 py-2"
  style={{
    color: getStatus(date) === "Present" ? "#4CAF50" : 
           getStatus(date) === "Absent" ? "#F44336" : 
           "rgba(0, 0, 0, 0.3)", 
    fontWeight: getStatus(date) !== "N/A" ? "bold" : "normal" ,
    backgroundColor: "transparent"
  }}
>
  {loading ? "Loading..." : getStatus(date)}
</td>
        </tr>
      );
    })}
  </tbody>
          </table>

          <button
            onClick={() => setSelectedSubject(null)}
            className="mt-4 px-4 py-2 bg-orange text-white rounded-md"
          >
            Back to Subjects
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;


*/}