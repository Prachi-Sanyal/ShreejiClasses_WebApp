import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherTimeTable = () => {
  const [timeTable, setTimeTable] = useState({});
  const [loading, setLoading] = useState(true);

  const timeSlots = [
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
  ];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/timetable/getTimeTable`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formattedTimeTable = {};
        days.forEach((day) => (formattedTimeTable[day] = {}));

        res.data.timeTable.forEach((entry) => {
          formattedTimeTable[entry.day][entry.timeSlot] = entry.subjects;
        });

        setTimeTable(formattedTimeTable);
      } catch (error) {
        console.error("Error fetching timetable:", error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeTable();
  }, []);

      
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Teacher TimeTable</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="w-full border-collapse border text-center">
          <thead>
            <tr className="bg-gray-300">
              <th className="border p-2">Day / Time</th>
              {timeSlots.map((slot, index) => (
                <th key={index} className="border p-2">
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => (
              <tr key={index} className="border">
                <td className="border p-2 font-semibold bg-gray-200">{day}</td>
                {timeSlots.map((slot, idx) => (
                  <td key={idx} className="border p-2">
                    {timeTable[day]?.[slot] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherTimeTable;
