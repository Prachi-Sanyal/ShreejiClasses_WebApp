import React, { useState, useEffect } from "react";
import axios from "axios";  
import { useLocation } from "react-router-dom";

import StudentSidebar from "../components/StudentSidebar";
import ProfileEdit from "../components/ProfileEdit"; 
import { useNavigate } from "react-router-dom"; 
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import StudentHome from "./StudentDashboard/StudentHome";
import StudentNotificationPage from "./StudentDashboard/StudentNotificationPage";
import StudentAttendance from "./StudentDashboard/StudentAttendance";
import StudentTimeTable from "./StudentDashboard/StudentTimeTable";
import StudentQuiz from "./StudentDashboard/StudentQuiz";
import StudentStudyMaterial from "./StudentDashboard/StudentStudyMaterial";
import StudentStudyChoose from "./StudentDashboard/StudentStudyChoose";
import StudentMarks from "./StudentDashboard/StudentMarks";
import StudentPayment from "./StudentDashboard/StudentPayment";


const StudentDashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [unreadCount, setUnreadCount] = useState(0); 
  const [notifications, setNotifications] = useState([]);
  const [activeSection, setActiveSection] = useState(
    window.history.state?.section || "home"
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const name = localStorage.getItem("name") || "Student"; 
  const email = localStorage.getItem("email") || "student@example.com"; 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate(); 
  const location = useLocation();


  useEffect(() => {
      fetchUnreadCount();
      const handleBackButton = (event) => {
        event.preventDefault();
        if (window.history.state?.section) {
          setActiveSection(window.history.state.section);
        } else {
          setShowLogoutModal(true);
        }
      };
  
      window.addEventListener("popstate", handleBackButton);
      return () => {
        window.removeEventListener("popstate", handleBackButton);
      };
    }, []);
    
  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/notifications`);
      const storedReadIds = JSON.parse(sessionStorage.getItem("readNotifications")) || [];

      const unreadNotifications = res.data.filter(
        (notification) => !storedReadIds.includes(notification._id)
      );

      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markNotificationsAsRead = () => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/notifications/mark-as-read`).catch((error) => {
      console.error("Error marking notifications as read:", error);
    });

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/notifications`).then((res) => {
      const allNotificationIds = res.data.map((notification) => notification._id);
      sessionStorage.setItem("readNotifications", JSON.stringify(allNotificationIds));
      setUnreadCount(0);
    });
  };

  const handleNotificationsClick = () => {
    setActiveSection("notifications");
    markNotificationsAsRead();
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    window.history.pushState({ section }, "", `#${section}`);
    setIsSidebarOpen(false); // Sidebar close when an option is selected

  };
  
  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <StudentHome />
      case "timetable":
        return <StudentTimeTable />
      case "attendance":
        return <StudentAttendance />
      case "progress":
        return <StudentMarks />
      case "resources":
        return <StudentStudyChoose />
      case "notifications":
        return <StudentNotificationPage />
      case "fees":
        return <StudentPayment />
      case "profileEdit":
        return <ProfileEdit />;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  const handleEditProfile = () => {
    setActiveSection("profileEdit");
    setIsProfileOpen(false); 
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
        credentials: "include", 
      });
  
      if (response.ok) {
        toast.success("Successfully logged out!"); 
        localStorage.removeItem("name"); 
        localStorage.removeItem("email");
  
        setTimeout(() => {
          navigate("/login"); 
        }, 1000); 
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-500 text-black p-4 flex items-center justify-between">
       
      <button
          className="md:hidden text-3xl text-black p-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>


        
        <div
  className={`flex items-center text-black text-xl transition-all duration-300 
  ${isSidebarOpen ? "hidden md:flex md:flex-row" : "flex w-full px-4 md:justify-left md:ml-64"}`}
>
  <div className="flex flex-wrap w-fit items-center">
    {/* Welcome back, part */}
    <span className="text-xl md:text-3xl break-words">
      Welcome back,&nbsp;
    </span>
    
    {/* Name + Wave together */}
    <span className="text-xl md:text-3xl inline-flex items-center whitespace-nowrap">
      {name}! <span role="img" aria-label="wave" className="text-3xl md:text-4xl ml-1">👋</span>
    </span>
  </div>
</div>

{/*

        <div className="flex-1 flex items-center space-x-6">
          <div className="text-2xl flex items-center space-x-2 text-black ml-64 p-2">
            <span className="text-3xl">Welcome back, {name}</span>
            <span role="img" aria-label="wave" className="text-4xl">👋</span>
          </div>
        </div>

        */}

        <div className="flex items-center space-x-4 relative">
          <div className="relative inline-block">
            <button
              className="text-black text-2xl relative"
              onClick={handleNotificationsClick}
            >
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <div>
            <button onClick={toggleProfileDropdown} className="text-black flex items-center space-x-2 text-2xl">
              <i className="fas fa-user-circle"></i>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md border border-gray-300 z-50">
                <div className="p-2">
                  <h3 className="font-semibold">{name}</h3>
                  <p className="text-sm text-gray-500">{email}</p>
                </div>
                <div className="border-t border-gray-200">
                  <button
                    onClick={handleEditProfile}
                    className="w-full text-blue-500 py-2 text-left px-4 hover:bg-pink-100 items-center space-x-2"
                  >
                    <i className="fas fa-edit"></i> 
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-red-500 py-2 text-left px-4 hover:bg-pink-100 items-center space-x-2"
                  >
                    <i className="fas fa-sign-out-alt"></i> 
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        <StudentSidebar setActiveSection={handleSectionChange} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        />

        <div 
        className={`flex-1 transition-all duration-300 p-6 bg-gray-100 
          md:w-[70%] md:ml-64 ${
              isSidebarOpen ? "ml-64" : "ml-0"
            }`}
          >
            {renderContent()}</div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p>Are you sure you want to logout?</p>
            <div className="flex justify-end mt-4">
              <button onClick={handleLogout} className="bg-orange text-white px-4 py-2 rounded-md mr-2">Yes</button>
              <button onClick={() => setShowLogoutModal(false)} className="bg-gray-300 px-4 py-2 rounded-md">No</button>
            </div>
          </div>
        </div>
      )}

        
      </div>
      
    
  );
};

export default StudentDashboard;
