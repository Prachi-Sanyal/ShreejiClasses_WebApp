import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/notifications/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Received Notifications:", res.data);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Notifications</h1>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No relevant notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif._id} className="p-4 border rounded flex justify-between items-center bg-white shadow">
              <div>
                <h2 className="font-semibold">{notif.title}</h2>
                <p>{notif.message}</p>
                <p className="text-sm text-gray-600">By: {notif.sender?.name || "Unknown Sender"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default StudentNotificationPage;
