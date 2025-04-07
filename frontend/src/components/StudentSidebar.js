import React from "react";
import logo from '../assets/img/logo.png'
import './Scroll.css'

const StudentSidebar = ({ setActiveSection, isSidebarOpen, setIsSidebarOpen }) => {
  return (
<div 
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-black flex flex-col shadow-lg transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-64"
      } md:translate-x-0 transition-transform duration-300 w-64`}
    >      
      

      <button 
        className="absolute top-4 right-4 text-2xl md:hidden"
        onClick={() => setIsSidebarOpen(false)}
      >
        ✖
      </button>


      <div className="flex items-center justify-start h-20 bg-gray-900 mb-6 mt-8">
        <img 
          src={logo} 
          alt="Logo" 
          className="h-48 lg:h-50" 
        />
      </div>

      
      <nav className="flex-1 p-4 overflow-y-scroll scrollbar-custom"> 
        <ul className="space-y-4">
          <li 
            className="hover:bg-gray-700 p-2 rounded cursor-pointer" 
            onClick={() => setActiveSection("home")}
          >
            <a className="flex items-center space-x-2">
              <span>🏠</span>
              <span>Home</span>
            </a>
          </li>
          <li 
            className="hover:bg-gray-700 rounded-lg p-2 cursor-pointer" 
            onClick={() => setActiveSection("timetable")}
          >
            <a className="flex items-center space-x-2">
              <span>📅</span>
              <span>Timetable</span>
            </a>
          </li>
          <li 
            className="hover:bg-gray-700 rounded-lg p-2 cursor-pointer" 
            onClick={() => setActiveSection("attendance")}
          >
            <a className="flex items-center space-x-2">
              <span>📊</span>
              <span>Attendance Record</span>
            </a>
          </li>
          <li 
            className="hover:bg-gray-700 rounded-lg p-2 cursor-pointer" 
            onClick={() => setActiveSection("progress")}
          >
            <a className="flex items-center space-x-2">
              <span>📈</span>
              <span>Progress Report</span>
            </a>
          </li>
          <li 
            className="hover:bg-gray-700 rounded-lg p-2 cursor-pointer" 
            onClick={() => setActiveSection("resources")}
          >
            <a className="flex items-center space-x-2">
              <span>📚</span>
              <span>Study Resources</span>
            </a>
          </li>
          <li 
            className="hover:bg-gray-700 rounded-lg p-2 cursor-pointer" 
            onClick={() => setActiveSection("notifications")}
          >
            <a className="flex items-center space-x-2">
              <span>🔔</span>
              <span>Notifications</span>
            </a>
          </li>
          <li 
            className="hover:bg-gray-700 rounded-lg p-2 cursor-pointer" 
            onClick={() => setActiveSection("fees")}
          >
            <a className="flex items-center space-x-2">
              <span>💰</span>
              <span>Pay Fees</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full bg-green text-white py-2 px-4 rounded-lg hover:bg-blue-500"
            onClick={() => setActiveSection("fees")} 
>
          View Fee Details
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
