import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEye, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const TeacherMarks = () => {
  const [course, setCourse] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [testTitle, setTestTitle] = useState("");
  const [testDate, setTestDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [marksData, setMarksData] = useState([]);
  const [uploadedRecords, setUploadedRecords] = useState([]);
  const [expandedRecord, setExpandedRecord] = useState(null);

  useEffect(() => {
    if (course && className && subject) {
      const token = localStorage.getItem("token");
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/marks/students?course=${course}&className=${className}&subject=${subject}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setStudents(res.data);
          setMarksData(
            res.data.map((s) => ({
              studentId: s._id,
              name: s.name,
              marksObtained: "",
              remarks: "",
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  }, [course, className, subject]);

  const handleMarksChange = (index, field, value) => {
    setMarksData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [field]: value };
      return updatedData;
    });
  };

  const uploadMarks = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/marks`,
        {
          students: marksData.map((s) => ({
            ...s,
            studentClass: className,
            selectedCourse: course,
            subjects: subject,
            testTitle,
            testDate,
            totalMarks,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.success("Marks uploaded successfully!");
        fetchUploadedRecords();
      })
      .catch(() => toast.error("Error uploading marks!"));
  };

  const fetchUploadedRecords = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/marks/teacher`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUploadedRecords(res.data))
      .catch(() => toast.error("Error fetching records!"));
  };

  useEffect(() => {
    fetchUploadedRecords();
  }, []);

  const handleDeleteMarks = (testTitle, testDate) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/api/marks/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { testTitle, testDate },
      })
      .then(() => {
        toast.success("Record deleted successfully!");
        fetchUploadedRecords();
      })
      .catch(() => toast.error("Error deleting record!"));
  };

  const handleExpand = (id) => {
    setExpandedRecord((prev) => (prev === id ? null : id));
  };
  
  return (
    <div className="p-5">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Upload Marks</h2>

      {/* Input Fields */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <input className="border p-2" type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
        <input className="border p-2" type="text" placeholder="Class" value={className} onChange={(e) => setClassName(e.target.value)} />
        <input className="border p-2" type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <input className="border p-2" type="text" placeholder="Test Title" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} />
        <input className="border p-2" type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} />
        <input className="border p-2" type="number" placeholder="Total Marks" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} />
      </div>

      {/* Table */}
      {students.length > 0 && (
        <table className="w-full border-collapse border border-gray-400 mb-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Marks</th>
              <th className="border p-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {marksData.map((s, index) => (
              <tr key={s.studentId} className="border">
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">
                  <input className="w-full p-1 border" type="number" value={s.marksObtained} onChange={(e) => handleMarksChange(index, "marksObtained", e.target.value)} />
                </td>
                <td className="border p-2">
                  <input className="w-full p-1 border" type="text" value={s.remarks} onChange={(e) => handleMarksChange(index, "remarks", e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="mt-4 p-2 bg-green text-white rounded" onClick={uploadMarks}>
        Upload Marks
      </button>

      {/* Uploaded Records */}
      <h3 className="text-xl font-bold mt-6">Uploaded Records</h3>
      {uploadedRecords.map((record) => (
        <div key={record._id} className="border p-2 mb-2 shadow">
          <p>
            <strong>{record.testTitle}</strong> ({moment(record.testDate).format("DD-MM-YYYY hh:mm A")})
          </p>
          <button 
  className="text-blue-500 mr-2" 
  onClick={(e) => {
    e.stopPropagation(); // Prevent parent click issues
    handleExpand(record._id);
  }}
>
  {expandedRecord === record._id ? <FaTimes /> : <FaEye />} {expandedRecord === record._id ? "Close" : "View"}
</button>



          <button className="text-red-500 ml-2" onClick={() => handleDeleteMarks(record.testTitle, record.testDate)}>
            <FaTrash /> Delete
          </button>
          {expandedRecord === record._id && (
            <div className="mt-2 bg-gray-100 p-2">
              <table className="w-full border-collapse border border-gray-400">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Marks</th>
                    <th className="border p-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {record.students.map((s, i) => (
                    <tr key={i}>
                      <td className="border p-2">{s.name}</td>
                      <td className="border p-2">{s.marksObtained}</td>
                      <td className="border p-2">{s.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeacherMarks;
