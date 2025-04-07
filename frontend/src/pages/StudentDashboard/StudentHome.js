import React, { useState,useEffect } from 'react';
import axios from "axios";

import { Line,Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";

import Calendar from 'react-calendar';
import DatePicker from 'react-datepicker';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSave, FaTrash } from "react-icons/fa"; // Importing Icons


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentHome = () => {
  const [attendance, setAttendance] = useState(75); 
  const [studyProgress, setStudyProgress] = useState(60); 
  const [reportData, setReportData] = useState([80, 85, 90, 88, 92, 94]); 
  const [subjectWisePercentage, setSubjectWisePercentage] = useState({});
  const [monthlyAttendance, setMonthlyAttendance] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState(""); // Note for selected date
  const [allNotes, setAllNotes] = useState({}); // Store all events

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/studentevents/all`);
      const notesMap = {};
      response.data.forEach((event) => {
        notesMap[event.date] = event.note;
      });
      setAllNotes(notesMap);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    setNote(allNotes[date.toDateString()] || ""); // Set note when selecting a date
  }, [date, allNotes]);

  // Save Note
  const handleSaveNote = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/studentevents/add`, {
        date: date.toDateString(),
        note,
      });
      fetchAllEvents();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Delete Note
  const handleDeleteNote = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/studentevents/delete/${date.toDateString()}`);
      fetchAllEvents();
      setNote("");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/studentDashboard/student-dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const { attendancePercentage, overallPercentage, subjectWisePercentage, monthlyReport } = response.data;

        setAttendance(attendancePercentage);
        setStudyProgress(overallPercentage);
        setSubjectWisePercentage(subjectWisePercentage);
        setMonthlyAttendance(monthlyReport.attendance);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  {/*
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], 
    datasets: [
      {
        label: "Monthly Study Progress",
        data: [60, 62, 65, 70, 75, 80], 
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Monthly Reports",
        data: reportData, 
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  */}

  const subjectPerformanceData = {
    labels: Object.keys(subjectWisePercentage),
    datasets: [
      {
        label: "Subject Performance (%)",
        data: Object.values(subjectWisePercentage),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverOffset: 4,
      },
    ],
  };

  // Bar Chart - Monthly Attendance
  const attendanceData = {
    labels: ["Present", "Total"],
    datasets: [
      {
        label: "Attendance",
        data: [monthlyAttendance.present || 0, monthlyAttendance.total || 0],
        backgroundColor: ["#4CAF50", "#FF5733"],
      },
    ],
  };

  {/*

  const chartData = {
    labels: Object.keys(reportData),
    datasets: [
      {
        label: "Monthly Study Progress",
        data: reportData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      }
    ],
  };

  */}




  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Student Dashboard</h1>
      <p className="text-gray-700">
        Keep track of your studies, attendance, and progress. 
        Use the sections below to monitor your performance and schedule.
      </p>

      {loading ? (
        <p className="text-gray-600 mt-4">Loading data...</p>
      ) : error ? (
        <p className="text-red-600 mt-4">{error}</p>
      ) :(
        <>
{/* Percentage Boxes */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-500 text-black p-4 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold">Attendance</h3>
              <p className="text-3xl font-bold">{attendance}%</p>
            </div>
            <div className="bg-green-500 text-black p-4 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold">Study Progress</h3>
              <p className="text-3xl font-bold">{studyProgress}%</p>
            </div>
            <div className="bg-yellow-500 text-black p-4 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold">Overall Performance</h3>
              <p className="text-3xl font-bold">85%</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Wise Performance - Doughnut Chart */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2 text-center">Subject-Wise Performance</h2>
              <Doughnut data={subjectPerformanceData} />
            </div>

            {/* Monthly Attendance - Bar Chart */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2 text-center">Monthly Attendance</h2>
              <Bar data={attendanceData} />
            </div>
          </div>



      </>
      )}
<div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Event Calendar</h1>
      <div className="bg-gray-100 p-4 rounded shadow">
        {/* Calendar */}
        <Calendar
  onChange={setDate}
  value={date}
  className="rounded-lg shadow-md"
  tileContent={({ date }) =>
    allNotes[date.toDateString()] ? (
      <div className="relative">
        {/* Green Dot to Indicate Note */}
        <div className="bg-green w-3 h-3 rounded-full mx-auto mt-1"></div>

        {/* Tooltip Box for Hover Effect */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-800 text-black text-xs p-1 rounded shadow-lg opacity-0 transition-opacity duration-200 hover:opacity-100 w-max max-w-xs">
          {allNotes[date.toDateString()]}
        </div>
      </div>
    ) : null
  }
/>
        <p className="mt-4 text-gray-700">Selected Date: {date.toDateString()}</p>

        {/* Note Input */}
        <textarea
          className="w-full mt-2 p-2 border rounded"
          rows="3"
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        {/* Buttons */}
        <div className="flex gap-4 mt-2">
  <button className="bg-green text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleSaveNote}>
    <FaSave /> {/* Save Icon */}
  </button>
  {note && (
    <button className="bg-orange text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleDeleteNote}>
      <FaTrash /> {/* Delete Icon */}
    </button>
  )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default StudentHome;
