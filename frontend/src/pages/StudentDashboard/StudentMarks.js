import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const StudentMarks = () => {
  const [tests, setTests] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setStudentId(decoded.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!studentId) return;
    
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/marks/dashboard/${studentId}`)
      .then((response) => {
        setTests(response.data.tests || []);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [studentId]);

  const formatMonthYear = (date) =>
    date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const currentMonthYear = formatMonthYear(currentDate);
  
  const filteredTests = tests.filter((test) => {
    const testDate = new Date(test.testDate);
    return (
      testDate.getMonth() === currentDate.getMonth() &&
      testDate.getFullYear() === currentDate.getFullYear()
    );
  });

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-center items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 bg-gray-200 rounded-full">
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-semibold mx-4">{currentMonthYear}</h2>
        <button onClick={handleNextMonth} className="p-2 bg-gray-200 rounded-full">
          <FaArrowRight />
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-medium mb-2">Test Records</h3>
        {filteredTests.length > 0 ? (
          <ul>
            {filteredTests.map((test) => (
              <li key={test.testDate} className="p-2 border-b">
                <strong>{test.testTitle}</strong> - {test.subjects} <br />
                Date: {new Date(test.testDate).toLocaleDateString()} <br />
                Marks: {test.marksObtained} / {test.totalMarks} <br /> Percentage: {parseFloat(test.percentage).toFixed(2)}%
                <br />
                {test.remarks && <em>Remarks: {test.remarks}</em>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No records available for this month.</p>
        )}
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-medium mb-2">Performance Charts</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={filteredTests.map(test => ({ name: test.testTitle, Marks: test.marksObtained }))}> 
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Marks" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filteredTests.map(test => ({ name: test.testTitle, Percentage: test.percentage }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="Percentage" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={filteredTests.map(test => ({ name: test.testTitle, value: test.percentage }))} cx="50%" cy="50%" outerRadius={80} label>
              {filteredTests.map((test, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#82ca9d" : "#ff6347"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudentMarks;