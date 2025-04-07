import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    sender: "", 
    recipientType: "",
    className: "",
    courseName: "",
    subjectName: "",
    sendToParents: false,
    sendSMSFlag: false,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setFormData((prev) => ({ ...prev, sender: decodedToken.userId })); 
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/notifications/teacher`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Received Notifications:", res.data); 

      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error.response?.data);
      toast.error("Failed to load notifications.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/notifications/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({
        title: "",
        message: "",
        sender: "", 
        recipientType: "",
        className: "",
        courseName: "",
        subjectName: "",
        sendToParents: false,
        sendSMSFlag: false,
      });
      fetchNotifications();
      toast.success("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification.");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(notifications.filter((n) => n._id !== id));
      toast.success("Notification deleted.");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Notifications</h1>

      <form onSubmit={sendNotification} className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Send a Notification</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-3"
        />
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-3"
        />

        <select
          name="recipientType"
          value={formData.recipientType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-3"
        >
          <option value="">Select Recipient Type</option>
          <option value="all_students">All Students</option>
          <option value="specific_class">Specific Class</option>
          <option value="specific_course">Specific Course</option>
          <option value="specific_subject">Specific Subject</option>
        </select>

        {formData.recipientType === "specific_class" && (
          <input
            type="text"
            name="className"
            placeholder="Class Name"
            value={formData.className}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          />
        )}
        {formData.recipientType === "specific_course" && (
          <input
            type="text"
            name="courseName"
            placeholder="Course Name"
            value={formData.courseName}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          />
        )}
        {formData.recipientType === "specific_subject" && (
          <>
            <input
              type="text"
              name="className"
              placeholder="Class Name"
              value={formData.className}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              name="subjectName"
              placeholder="Subject Name"
              value={formData.subjectName}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            />
          </>
        )}

        <label className="inline-flex items-center mb-3">
          <input
            type="checkbox"
            name="sendToParents"
            checked={formData.sendToParents}
            onChange={handleChange}
          />
          <span className="ml-2">Send to Parents</span>
        </label>
        <label className="inline-flex items-center mb-3">
          <input
            type="checkbox"
            name="sendSMSFlag"
            checked={formData.sendSMSFlag}
            onChange={handleChange}
          />
          <span className="ml-2">Send SMS Notification</span>
        </label>

        <button type="submit" className="bg-green text-white px-4 py-2 rounded w-full">
          Send Notification
        </button>
      </form>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif._id} className="p-4 border rounded flex justify-between items-center bg-white shadow">
              <div>
                <h2 className="font-semibold">{notif.title}</h2>
                <p>{notif.message}</p>
                <p className="text-sm text-gray-600">
                  By: {notif.sender ? notif.sender.name : "Unknown Role"}
                </p>
              </div>
              <button
                onClick={() => deleteNotification(notif._id)}
                className="bg-orange text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default TeacherNotificationPage;
