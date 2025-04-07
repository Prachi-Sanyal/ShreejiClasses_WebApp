import React, { useState } from "react";
import TeacherSidebar from "../components/TeacherSidebar";

const TeacherDashboardTrial = () => {
  const [activeSection, setActiveSection] = useState("home"); 
  const [isProfileOpen, setIsProfileOpen] = useState(false); 

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <div>Welcome to the Teacher Dashboard Home Page!</div>;
      case "schedule":
        return <div>Manage Schedule</div>;
      case "attendance":
        return <div>Take Attendance</div>;
      case "uploadResources":
        return <div>Upload Study Resources</div>;
      case "uploadMarks":
        return <div>Upload Test Marks</div>;
      case "notifications":
        return <div>Send Push Notifications</div>;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-500 text-black p-4 flex items-center justify-between">
        <div className="flex-1 flex items-center space-x-6">
          <div className="text-2xl flex items-center space-x-2 text-black ml-64 p-2">
            <span className="text-3xl">Welcome back</span>
            <span role="img" aria-label="wave" className="text-4xl">👋</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <button className="text-black text-2xl">
              <i className="fas fa-bell"></i>
            </button>
            <span className="absolute top-0 right-0 bg-red-500 text-xs text-black rounded-full w-4 h-4 flex items-center justify-center">
              3 
            </span>
          </div>

          <div>
            <button onClick={toggleProfileDropdown} className="text-black flex items-center space-x-2 text-2xl">
              <i className="fas fa-user-circle"></i>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md border border-gray-300 z-50">
                <div className="p-2">
                  <h3 className="font-semibold">Teacher Name</h3>
                  <p className="text-sm text-gray-500">teacher@example.com</p>
                </div>
                <div className="border-t border-gray-200">
                  <button className="w-full text-blue-500 py-2 text-left px-4 hover:bg-pink-100 items-center space-x-2">
                    <i className="fas fa-edit"></i> 
                    <span>Edit Profile</span>
                  </button>
                  <button className="w-full text-red-500 py-2 text-left px-4 hover:bg-pink-100 items-center space-x-2">
                    <i className="fas fa-sign-out-alt"></i> 
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        <TeacherSidebar setActiveSection={setActiveSection} />

        <div className="flex-1 ml-64 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardTrial;
