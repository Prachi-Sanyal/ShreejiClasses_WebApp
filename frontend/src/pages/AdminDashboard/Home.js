import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import Calendar from 'react-calendar';
import DatePicker from 'react-datepicker';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
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

const Home = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState(""); 
  const [allNotes, setAllNotes] = useState({});
  // Fetch statistics from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stats/dashboard-stats`);
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/adminEvents/all`);
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
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/adminEvents/add`, {
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
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/adminEvents/delete/${date.toDateString()}`);
      fetchAllEvents();
      setNote("");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };


  

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Students",
        data: [stats.totalStudents, stats.totalStudents + 10, stats.totalStudents + 20, stats.totalStudents + 30, stats.totalStudents + 40, stats.totalStudents + 50],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Total Teachers",
        data: [stats.totalTeachers, stats.totalTeachers + 2, stats.totalTeachers + 4, stats.totalTeachers + 6, stats.totalTeachers + 8, stats.totalTeachers + 10],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
      {
        label: "Total Courses",
        data: [stats.totalCourses, stats.totalCourses + 1, stats.totalCourses + 2, stats.totalCourses + 3, stats.totalCourses + 4, stats.totalCourses + 5],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: true,
      },
      
    ],
  };

  // Add new task to backend
  const addTask = async () => {
    if (newTask) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, {
          task: newTask,
          deadline: deadline,
        });
        setTasks([...tasks, response.data]);
        setNewTask('');
        setDeadline(new Date());
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  // Update task progress
  const updateTaskProgress = async (taskId) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${taskId}`);
      const updatedTasks = tasks.map(task => task._id === taskId ? response.data : task);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task progress:", error);
    }
  };

  
  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };


  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
      <p className="text-gray-700">
        This is the main control panel for managing students, teachers, courses, and other activities. 
        Use the sidebar to navigate through different sections.
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="text-lg font-bold">Total Students</h3>
            <p className="text-3xl">{stats.totalStudents}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="text-lg font-bold">Total Teachers</h3>
            <p className="text-3xl">{stats.totalTeachers}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="text-lg font-bold">Total Courses</h3>
            <p className="text-3xl">{stats.totalCourses}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Charts</h2>
        <div className="bg-white p-4 rounded shadow">
          <Line data={chartData} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Task Management</h2>
        <div className="bg-gray-100 p-4 rounded shadow mb-4">
          <input 
            type="text" 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)} 
            className="p-2 w-full mb-2 border border-gray-300 rounded"
            placeholder="Enter a new task" 
          />
          <DatePicker
            selected={deadline}
            onChange={(date) => setDeadline(date)}
            className="p-2 w-full mb-2 border border-gray-300 rounded"
            placeholderText="Select a deadline"
          />
          <button 
            onClick={addTask} 
            className="w-full bg-green text-white p-2 rounded"
          >
            Add Task
          </button>
        </div>
        </div>



        <div className="mt-4">
          <ul>
            {tasks.map((task) => (
              <li key={task._id} className="flex justify-between items-center bg-white p-4 mb-2 rounded shadow">
                <div>
                  <h3 className="font-bold">{task.task}</h3>
                  <p className="text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 rounded mr-2">
                    <div 
                      className="h-full bg-orange rounded"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  
                  <button 
                    onClick={() => deleteTask(task._id)} 
                    className="ml-2 bg-orange text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
              ))}
              </ul>

<div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Event Calendar</h2>
        <div className="bg-gray-100 p-4 rounded shadow">
          <Calendar onChange={setDate} value={date} />
          <textarea
            className="w-full p-2 border mt-4"
            placeholder="Enter note for the selected date..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex mt-2">
            <button onClick={handleSaveNote} className="bg-green text-white px-4 py-2 rounded mr-2 flex items-center">
              <FaSave className="mr-1" /> Save
            </button>
            <button onClick={handleDeleteNote} className="bg-orange text-white px-4 py-2 rounded flex items-center">
              <FaTrash className="mr-1" /> Delete
            </button>
          </div>
        </div>
         
      </div>
    </div>
          
        </div>
     
    
  );
};

export default Home;
