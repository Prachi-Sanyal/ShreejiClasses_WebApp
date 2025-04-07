import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaSave, FaTrash } from "react-icons/fa"; // Icons
import { IoMdAddCircleOutline } from "react-icons/io"; // Add Icon
import t1 from '../../assets/img/teacherDashboard.jpeg';


const quotesList = [
  "Teaching is the greatest act of optimism. - Colleen Wilcox",
  "The best teachers teach from the heart, not from the book. - Unknown",
  "A teacher affects eternity; he can never tell where his influence stops. - Henry Adams",
  "Education is not the filling of a pot but the lighting of a fire. - W.B. Yeats",
  "Those who educate children well are more to be honored than parents. - Aristotle",
];

const TeacherHome = () => {
  const [quote, setQuote] = useState("");
  const [date, setDate] = useState(new Date());
  const [eventNote, setEventNote] = useState("");
  const [allEvents, setAllEvents] = useState({});
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setQuote(quotesList[Math.floor(Math.random() * quotesList.length)]);
    fetchAllEvents();
    fetchTasks();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/teacherEvents/all`);
      const eventsMap = {};
      response.data.forEach((event) => {
        eventsMap[event.date] = event.note;
      });
      setAllEvents(eventsMap);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSaveEvent = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/teacherEvents/add`, {
        date: date.toDateString(),
        note: eventNote,
      });
      fetchAllEvents();
      setEventNote("");
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/teacherEvents/delete/${date.toDateString()}`);
      fetchAllEvents();
      setEventNote("");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/teacherTasks/all`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    if (!task.trim()) return;
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/teacherTasks/add`, { task });
      fetchTasks();
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/teacherTasks/delete/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    
      <div className="p-4 max-w-5xl mx-auto">
        {/* Quotes Section */}
        <div className="bg-blue-500 text-black p-4 rounded-lg shadow-md flex flex-col md:flex-row items-center md:items-start gap-4">
      
      {/* 📷 Image on Left */}
      <img 
        src={t1} 
        alt="Teacher Quote" 
        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
      />

      {/* 📝 Quote Text on Right */}
      <div className="text-center md:text-left flex-1">
        <h2 className="text-lg md:text-xl font-semibold">💡 Quote of the Day</h2>
        <p className="mt-2 italic text-md md:text-lg">
          <span className="text-2xl md:text-3xl">“</span>{quote}<span className="text-2xl md:text-3xl">”</span>
        </p>
      </div>
      
    </div>
    
        {/* Flex Container for Calendar and To-Do List */}
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          
          {/* 📅 Event Calendar (Left Side) */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex-1">
            <h2 className="text-lg font-semibold mb-3">📅 Event Calendar</h2>
            <Calendar
              onChange={setDate}
              value={date}
              className="rounded-lg shadow-md w-full"
              tileContent={({ date }) =>
                allEvents[date.toDateString()] ? (
                  <div className="relative">
                    <div className="bg-green w-3 h-3 rounded-full mx-auto mt-1"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-800 text-black text-xs p-1 rounded shadow-lg opacity-0 transition-opacity duration-200 hover:opacity-100 w-max max-w-xs">
                      {allEvents[date.toDateString()]}
                    </div>
                  </div>
                ) : null
              }
            />
            <p className="mt-4 text-gray-700">Selected Date: {date.toDateString()}</p>
            <textarea
              className="w-full mt-2 p-2 border rounded"
              rows="2"
              placeholder="Add an event..."
              value={eventNote}
              onChange={(e) => setEventNote(e.target.value)}
            ></textarea>
    
            <div className="flex gap-4 mt-2">
              <button className="bg-green text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleSaveEvent}>
                <FaSave /> Save
              </button>
              {eventNote && (
                <button className="bg-orange text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleDeleteEvent}>
                  <FaTrash /> Delete
                </button>
              )}
            </div>
          </div>
    
          {/* ✅ To-Do List (Right Side) */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex-1">
            <h2 className="text-lg font-semibold mb-3">✅ To-Do List</h2>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow p-2 border rounded"
                placeholder="Add a task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <button
                className="bg-green text-white px-4 py-2 rounded"
                onClick={handleAddTask}
              >
                <IoMdAddCircleOutline size={20} />
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {tasks.map((t) => (
                <li
                  key={t._id}
                  className="flex justify-between items-center bg-white p-2 rounded shadow"
                >
                  <span>{t.task}</span>
                  <button
                    className="text-orange"
                    onClick={() => handleDeleteTask(t._id)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>
    
        </div>
      </div>
    );
    

};

export default TeacherHome;
