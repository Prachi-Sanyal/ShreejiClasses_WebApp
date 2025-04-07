import React, { useState, useEffect, useRef } from "react";
import StudentSidebar from "../components/StudentSidebar";

const StudentDashboardTrial = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".text-2xl")
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <div>Welcome to the Student Dashboard Home Page!</div>;
      case "timetable":
        return <div>View Timetable</div>;
      case "attendance":
        return <div>View Attendance Record</div>;
      case "progress":
        return <div>View Progress Report</div>;
      case "resources":
        return <div>Study Resources</div>;
      case "notifications":
        return <div>View Notifications</div>;
      case "fees":
        return <div>Pay Fees</div>;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarOpen(false); 
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-500 text-black p-4 flex items-center justify-between relative">
        <button
          className="text-black text-2xl absolute left-4 lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)} 
        >
          <i className="fas fa-bars"></i>
        </button>

        <div className="flex-1 flex items-center space-x-6 justify-center">
          <div className="text-2xl flex items-center space-x-2 text-black p-2">
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
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-gray-500">student@example.com</p>
                </div>
                <div className="border-t border-gray-200">
                  <button className="w-full text-blue-500 py-2 text-left px-4 hover:bg-pink-100 items-center space-x-2">
                    <i className="fas fa-edit"></i> Edit Profile
                  </button>
                  <button className="w-full text-red-500 py-2 text-left px-4 hover:bg-pink-100 items-center space-x-2">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        <div
          ref={sidebarRef}
          className={`lg:flex ${sidebarOpen ? "block" : "hidden"} lg:block fixed top-0 left-0 z-50 w-64 h-full bg-gray-800 text-white transition-all`}
        >
          <StudentSidebar setActiveSection={handleSectionChange} />
        </div>

        <div
          className={`flex-1 p-8 transition-all ${sidebarOpen ? "ml-64" : ""}`} 
        >
          <div className="mx-auto max-w-4xl">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardTrial;
