import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaEdit } from "react-icons/fa"; // Importing icons

const PaymentStatus = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [paymentData, setPaymentData] = useState({
    userId: "",
    paidAmount: "",
    remainingAmount: "",
    status: "",
    remainingInstallments: "",
    nextDueDate: "",
    paymentType: "",
    installmentPlan: "",
  });
  const [statusFilter, setStatusFilter] = useState("All");

  const token = localStorage.getItem("token");

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fees/all-students-payment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data);
      setFilteredPayments(response.data); // Initially no filter applied
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setStatusFilter(filter);
    if (filter === "All") {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(payments.filter((payment) => payment.paymentStatus === filter));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleUpdatePayment = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/fees/update-payment`,
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      fetchPayments();
      setEditMode(false);
      setPaymentData({
        userId: "",
        paidAmount: "",
        remainingAmount: "",
        status: "",
        remainingInstallments: "",
        nextDueDate: "",
        paymentType: "",
        installmentPlan: "",
      });
    } catch (error) {
      console.error("Error updating payment", error);
      alert("Error updating payment");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">💰 Payment Status Details</h1>

      {/* Filter Dropdown */}
      <div className="mb-6">
        <label className="mr-2" htmlFor="statusFilter">Filter by Payment Status:</label>
        <select
          id="statusFilter"
          className="p-2 border rounded-md"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="All">All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="installments_pending">Installments Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {editMode ? (
        <div className="mb-6 bg-gray-100 p-4 rounded-md relative">
          <h2 className="text-xl font-semibold mb-4">✏️ Edit Payment</h2>
          <FaTimes
            className="absolute top-2 right-2 text-red-500 cursor-pointer text-xl"
            onClick={() => setEditMode(false)}
          />
          <div className="space-y-4">
            <input
              type="text"
              name="userId"
              placeholder="Student ID"
              value={paymentData.userId}
              className="w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed"
              disabled
            />
            <input
              type="number"
              name="paidAmount"
              placeholder="💵 Paid Amount"
              value={paymentData.paidAmount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              name="remainingAmount"
              placeholder="💰 Remaining Amount"
              value={paymentData.remainingAmount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />

            {/* Status Dropdown */}
            <select
              name="status"
              value={paymentData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">📌 Select Status</option>
              <option value="pending">Pending</option>
  <option value="paid">Paid</option>
  <option value="installments_pending">Installments Pending</option>
  <option value="completed">Completed</option>
            </select>

            {/* Payment Type Dropdown */}
            <select
              name="paymentType"
              value={paymentData.paymentType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">💳 Select Payment Type</option>
              <option value="complete">Complete</option>
              <option value="installment">Installment</option>
            </select>

            {/* Installment Plan Dropdown (Visible only if paymentType is Installment) */}
            {paymentData.paymentType === "installment" && (
              <select
                name="installmentPlan"
                value={paymentData.installmentPlan}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">📆 Select Installment Plan</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
              </select>
            )}

            <input
              type="number"
              name="remainingInstallments"
              placeholder="📆 Remaining Installments"
              value={paymentData.remainingInstallments}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="date"
              name="nextDueDate"
              value={paymentData.nextDueDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <button onClick={handleUpdatePayment} className="bg-green text-white p-2 rounded-md">
              ✅ Update Payment Status
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div key={payment.studentId} className="border p-4 rounded-md shadow-md flex justify-between bg-white">
              <div>
                <h3 className="text-lg font-semibold">👤 {payment.name || "Unknown User"}</h3>
                <p>📖 <strong>Course:</strong> {payment.course || "N/A"}</p>
                <p>🏫 <strong>Class:</strong> {payment.class || "N/A"}</p>
                <p>📧 <strong>Email:</strong> {payment.email || "N/A"}</p>
                <p>📚 <strong>Subjects:</strong> {payment.subjects ? payment.subjects.join(", ") : "N/A"}</p>
              </div>
              <div className="flex flex-col items-end">
                <p>💵 <strong>Paid:</strong> {payment.paidAmount}</p>
                <p>💰 <strong>Remaining:</strong> {payment.remainingAmount}</p>
                <p>📌 <strong>Status:</strong> {payment.paymentStatus}</p>
                <p>🗓️ <strong>Remaining Installments:</strong> {payment.remainingInstallments || "N/A"}</p>
<p>📅 <strong>Next Due Date:</strong> 
  {payment.nextDueDate && !isNaN(new Date(payment.nextDueDate)) 
    ? new Date(payment.nextDueDate).toLocaleDateString() 
    : "N/A"}
    </p>
                <button
                  onClick={() => {
                    setEditMode(true);
                    setPaymentData({
                      userId: payment.studentId || "",
                      paidAmount: payment.paidAmount,
                      remainingAmount: payment.remainingAmount,
                      status: payment.paymentStatus,
                      remainingInstallments: payment.remainingInstallments,
                      paymentType: payment.paymentType || "",
                      installmentPlan: payment.installmentPlan || "",
                    });
                  }}
                  className="bg-green text-white p-2 rounded-md mt-2 flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;






{/*
  
  import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaEdit } from "react-icons/fa"; // Importing icons

const PaymentStatus = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [paymentData, setPaymentData] = useState({
    userId: "",
    paidAmount: "",
    remainingAmount: "",
    status: "",
    remainingInstallments: "",
    nextDueDate: "",
  });
  const [statusFilter, setStatusFilter] = useState("All");

  const token = localStorage.getItem("token");

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fees/all-students-payment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data);
      setFilteredPayments(response.data); // Initially no filter applied
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setStatusFilter(filter);

    if (filter === "All") {
      setFilteredPayments(payments); // Show all payments
    } else {
      const filtered = payments.filter((payment) => payment.paymentStatus === filter);
      setFilteredPayments(filtered);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleUpdatePayment = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/fees/update-payment",
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      fetchPayments();
      setEditMode(false);
      setPaymentData({
        userId: "",
        paidAmount: "",
        remainingAmount: "",
        status: "",
        remainingInstallments: "",
        nextDueDate: "",
      });
    } catch (error) {
      console.error("Error updating payment", error);
      alert("Error updating payment");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">💰 Payment Status Details</h1>

      <div className="mb-6">
        <label className="mr-2" htmlFor="statusFilter">Filter by Payment Status:</label>
        <select
          id="statusFilter"
          className="p-2 border rounded-md"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Partially Paid">Pa</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {editMode ? (
        <div className="mb-6 bg-gray-100 p-4 rounded-md relative">
          <h2 className="text-xl font-semibold mb-4">✏️ Edit Payment</h2>
          <FaTimes
            className="absolute top-2 right-2 text-red-500 cursor-pointer text-xl"
            onClick={() => setEditMode(false)}
          />
          <div className="space-y-4">
            <input
              type="text"
              name="userId"
              placeholder="Student ID"
              value={paymentData.userId}
              className="w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed"
              disabled
            />
            <input
              type="number"
              name="paidAmount"
              placeholder="💵 Paid Amount"
              value={paymentData.paidAmount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              name="remainingAmount"
              placeholder="💰 Remaining Amount"
              value={paymentData.remainingAmount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              name="status"
              placeholder="📌 Status (Paid, Pending)"
              value={paymentData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              name="remainingInstallments"
              placeholder="📆 Remaining Installments"
              value={paymentData.remainingInstallments}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="date"
              name="nextDueDate"
              value={paymentData.nextDueDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <button onClick={handleUpdatePayment} className="bg-green text-white p-2 rounded-md">
              ✅ Update Payment Status
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div key={payment.studentId} className="border p-4 rounded-md shadow-md flex justify-between bg-white">
              <div>
                <h3 className="text-lg font-semibold">👤 {payment.name || "Unknown User"}</h3>
                <p>📖 <strong>Course:</strong> {payment.course || "N/A"}</p>
                <p>🏫 <strong>Class:</strong> {payment.class || "N/A"}</p>
                <p>📧 <strong>Email:</strong> {payment.email || "N/A"}</p>
                <p>📚 <strong>Subjects:</strong> {payment.subjects ? payment.subjects.join(", ") : "N/A"}</p>
                </div>
              <div className="flex flex-col items-end">
                <p>💵 <strong>Paid:</strong> {payment.paidAmount}</p>
                <p>💰 <strong>Remaining:</strong> {payment.remainingAmount}</p>
                <p>📌 <strong>Status:</strong> {payment.paymentStatus}</p>
                <p>🗓️ <strong>Remaining Installments:</strong> {payment.remainingInstallments || "N/A"}</p>
<p>📅 <strong>Next Due Date:</strong> 
  {payment.nextDueDate && !isNaN(new Date(payment.nextDueDate)) 
    ? new Date(payment.nextDueDate).toLocaleDateString() 
    : "N/A"}
</p>
                <button
                  onClick={() => {
                    setEditMode(true);
                    setPaymentData({
                      userId: payment.studentId || "",
                      paidAmount: payment.paidAmount,
                      remainingAmount: payment.remainingAmount,
                      status: payment.paymentStatus,
                      remainingInstallments: payment.remainingInstallments,
                    });
                  }}
                  className="bg-green text-white p-2 rounded-md mt-2 flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;


*/}




{/*
    
    import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaEdit } from "react-icons/fa"; // Importing icons

const PaymentStatus = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [paymentData, setPaymentData] = useState({
    userId: "",
    paidAmount: "",
    remainingAmount: "",
    status: "",
    remainingInstallments: "",
    nextDueDate: "",
  });

  const token = localStorage.getItem("token");

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fees/all-payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleUpdatePayment = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/fees/update-payment",
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      fetchPayments();
      setEditMode(false);
      setPaymentData({
        userId: "",
        paidAmount: "",
        remainingAmount: "",
        status: "",
        remainingInstallments: "",
        nextDueDate: "",
      });
    } catch (error) {
      console.error("Error updating payment", error);
      alert("Error updating payment");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">💰 Payment Status Details</h1>

      {editMode ? (
        <div className="mb-6 bg-gray-100 p-4 rounded-md relative">
          <h2 className="text-xl font-semibold mb-4">✏️ Edit Payment</h2>
        
          <FaTimes
            className="absolute top-2 right-2 text-red-500 cursor-pointer text-xl"
            onClick={() => setEditMode(false)}
          />
          <div className="space-y-4">
            <input
              type="text"
              name="userId"
              placeholder="Student ID"
              value={paymentData.userId}
              className="w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed"
              disabled
            />
            <input
              type="number"
              name="paidAmount"
              placeholder="💵 Paid Amount"
              value={paymentData.paidAmount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              name="remainingAmount"
              placeholder="💰 Remaining Amount"
              value={paymentData.remainingAmount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              name="status"
              placeholder="📌 Status (Paid, Pending)"
              value={paymentData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              name="remainingInstallments"
              placeholder="📆 Remaining Installments"
              value={paymentData.remainingInstallments}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="date"
              name="nextDueDate"
              value={paymentData.nextDueDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <button onClick={handleUpdatePayment} className="bg-green-500 text-white p-2 rounded-md">
              ✅ Update Payment Status
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment._id} className="border p-4 rounded-md shadow-md flex justify-between bg-white">
              <div>
                <h3 className="text-lg font-semibold">👤 {payment.user?.name || "Unknown User"}</h3>
                <p>📖 <strong>Course:</strong> {payment.user?.selectedCourse?.join(", ") || "N/A"}</p>
                <p>🏫 <strong>Class:</strong> {payment.user?.studentClass?.join(", ") || "N/A"}</p>
                <p>📧 <strong>Email:</strong> {payment.user?.email || "N/A"}</p>
                <p>📚 <strong>Subjects:</strong> {payment.user?.subjects?.join(", ") || "N/A"}</p>
              </div>
              <div className="flex flex-col items-end">
                <p>💵 <strong>Paid:</strong> {payment.paidAmount}</p>
                <p>💰 <strong>Remaining:</strong> {payment.remainingAmount}</p>
                <p>📌 <strong>Status:</strong> {payment.status}</p>
                <p>🗓️ <strong>Remaining Installments:</strong> {payment.remainingInstallments}</p>
                <p>📅 <strong>Next Due Date:</strong> {new Date(payment.nextDueDate).toLocaleDateString()}</p>
                <button
                  onClick={() => {
                    setEditMode(true);
                    setPaymentData({
                      userId: payment.user?._id || "",
                      paidAmount: payment.paidAmount,
                      remainingAmount: payment.remainingAmount,
                      status: payment.status,
                      remainingInstallments: payment.remainingInstallments,
                      nextDueDate: payment.nextDueDate
                        ? new Date(payment.nextDueDate).toISOString().split("T")[0]
                        : "",
                    });
                  }}
                  className="bg-blue-500 text-white p-2 rounded-md mt-2 flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;


*/}