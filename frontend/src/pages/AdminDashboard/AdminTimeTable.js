import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaEdit, FaTrash, FaTimes } from "react-icons/fa"; 


const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = ["3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM"];

const AdminTimeTable = () => {
  const [userType, setUserType] = useState("teacher");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [name, setName] = useState("");
  const [timeTable, setTimeTable] = useState({});
  const [timeTables, setTimeTables] = useState([]);
  const [filterUserType, setFilterUserType] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [viewingTable, setViewingTable] = useState(null);

  useEffect(() => {
    fetchTimeTables();
  }, []);

  const fetchTimeTables = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/timetable/getAllTimeTables`);
      setTimeTables(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (day, slot, value) => {
    setTimeTable((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slot]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedTimeTable = Object.entries(timeTable).flatMap(([day, slots]) =>
        Object.entries(slots).map(([timeSlot, subjects]) => ({ day, timeSlot, subjects }))
      );

      const payload =
        userType === "teacher"
          ? { userType, name, timeTable: formattedTimeTable }
          : { userType, selectedCourse, studentClass, timeTable: formattedTimeTable };

      if (editingId) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/timetable/updateTimeTable/${editingId}`, payload);
        toast.success("Timetable updated successfully!");
        setEditingId(null);
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/timetable/upload`, payload);
        toast.success("Timetable uploaded successfully!");
      }

      setTimeTable({});
      fetchTimeTables();
    } catch (error) {
      toast.error("Error while uploading timetable");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/timetable/deleteTimeTable/${id}`);
      toast.success("Timetable deleted!");
      fetchTimeTables();
    } catch (error) {
      toast.error("Error while deleting timetable");
      console.error(error);
    }
  };

  const handleEdit = (timetable) => {
    setEditingId(timetable._id);
    setUserType(timetable.userType);
    setName(timetable.name || "");
    setTeacherId(timetable.teacherId || "");
    setSelectedCourse(timetable.selectedCourse || "");
    setStudentClass(timetable.studentClass || "");

    const structuredTable = {};
    timetable.timeTable.forEach(({ day, timeSlot, subjects }) => {
      if (!structuredTable[day]) structuredTable[day] = {};
      structuredTable[day][timeSlot] = subjects;
    });
    setTimeTable(structuredTable);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setUserType("");
    setName("");
    setTeacherId("");
    setSelectedCourse("");
    setStudentClass("");
    setTimeTable({});
  };
  

  const handleView = (timetable) => {
    setViewingTable(timetable);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin TimeTable Management</h1>

      

      
      <div className="border p-4 mb-6 bg-gray-100">
        <h2 className="text-lg font-bold mb-2">{editingId ? "Update Timetable" : "Upload Timetable"}</h2>

        <div className="flex gap-4 mb-4">
          <select className="border p-2" value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          {userType === "teacher" ? (
            <input type="text" placeholder="Teacher Name" className="border p-2" value={name} onChange={(e) => setName(e.target.value)} />
          ) : (
            <>
              <input type="text" placeholder="Selected Course" className="border p-2" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} />
              <input type="text" placeholder="Class" className="border p-2" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} />
            </>
          )}
        </div>

        {/* TimeTable Grid */}
        <table className="w-full border-collapse border bg-white">
          <thead>
            <tr className="bg-blue-200">
              <th className="border p-2">Days</th>
              {timeSlots.map((slot) => (
                <th key={slot} className="border p-2">{slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="border p-2 font-bold bg-yellow-100">{day}</td>
                {timeSlots.map((slot) => (
                  <td key={slot} className="border p-2">
                    <input
                      type="text"
                      className="w-full p-1"
                      placeholder={userType === "teacher" ? "Class" : "Subject"}
                      value={timeTable[day]?.[slot] || ""}
                      onChange={(e) => handleInputChange(day, slot, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
        <button className="bg-green text-white p-2 mt-4" onClick={handleSubmit}>
          {editingId ? "Update Timetable" : "Upload Timetable"}
        </button>

        {editingId && (
  <button 
    className="bg-orange text-white p-2 mt-4 flex items-center gap-1"
    onClick={handleCancelEdit}
  >
    <FaTimes /> Cancel
  </button>
)}
</div>
      </div>

      
      <h2 className="text-lg font-bold mb-2">Existing Timetables</h2>

      
      <div className="flex gap-4 mb-4">
        <select className="border p-2" value={filterUserType} onChange={(e) => setFilterUserType(e.target.value)}>
          <option value="all">All</option>
          <option value="teacher">Teachers</option>
          <option value="student">Students</option>
        </select>
      </div>

      <table className="w-full border-collapse border">

        
        <tbody>
          {timeTables
            .filter((tt) => filterUserType === "all" || tt.userType === filterUserType)
            .map((tt) => (
              <tr key={tt._id}>
                <td className="border p-2">{tt.userType}</td>
                <td className="border p-2">{tt.userType === "teacher" ? tt.name : tt.selectedCourse}</td>
                <td className="border p-2">{tt.studentClass || "N/A"}</td>
                <td className="border p-2 flex">
                  <button className="flex items-center gap-1 p-1 mx-1 rounded"
                  style={{ backgroundColor: "#28a745", color: "white" }}
                   onClick={() => handleEdit(tt)}>  Edit <FaEdit />
                   </button>
                  <button className="flex items-center gap-1 text-white p-1 mx-1 rounded" 
                      style={{ backgroundColor: "#dc3545", color: "white" }} // Red color for Delete

                  onClick={() => handleDelete(tt._id)}>Delete <FaTrash /></button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTimeTable;
