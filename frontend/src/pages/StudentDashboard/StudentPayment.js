import React, { useState, useEffect } from "react";
import axios from "axios";
import Receipt from "./Receipt";

const StudentPayment = () => {
  const [amount, setAmount] = useState("");
  const [installmentPlan, setInstallmentPlan] = useState("");
  const [paymentType, setPaymentType] = useState("full");
  const [user, setUser] = useState(null);
  const [feeDetails, setFeeDetails] = useState(null);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPayments, setUserPayments] = useState([]);

  // Fetch authorization token
  const authHeader = () => {
    const userToken = localStorage.getItem("token");
    return userToken ? { Authorization: `Bearer ${userToken}` } : {};
  };

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/profile`, {
          headers: authHeader(),
        });
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch user payment history
  useEffect(() => {
    const fetchUserPayments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fees/payment-history`, {
          headers: authHeader(),
        });

        if (response.data.length > 0) {
          setUserPayments(response.data);

          const latestPayment = response.data[0]; // Latest payment record

          if (latestPayment.status === "installments_pending") {
            setPaymentType("installment");
            setInstallmentPlan(latestPayment.installmentPlan);
            //setAmount(latestPayment.remainingAmount || latestPayment.amount);
            setAmount(latestPayment.amount);

            console.log("🔍 Latest Payment Data:", latestPayment);
          } else if (latestPayment.status === "pending") {
            setPaymentType("full");
            fetchFeeDetails();
          }else if (latestPayment.status === "completed") {
            setPaymentType("full");
          }
        } else {
          fetchFeeDetails();
        }
      } catch (error) {
        console.error("Error fetching user payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPayments();
  }, []);

  const fetchFeeDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fees/student/fees`, {
        headers: authHeader(),
      });

      setFeeDetails(response.data);
      if (!amount || amount === 0) {
        setAmount(response.data.fullYearlyFee);
      }
    } catch (error) {
      console.error("Error fetching fee details:", error);
    }
  };

  const handleInstallmentChange = (plan) => {
    setInstallmentPlan(plan);

    let totalFee = feeDetails?.fullYearlyFee || amount; // Ensure correct total fee
    let paidPayments = userPayments.filter(payment => payment.status !== "pending");
    let paidAmount = paidPayments.reduce((acc, payment) => acc + (payment.paidAmount || 0), 0);
    let remainingAmountCalc = totalFee - paidAmount;

    let installmentAmountCalc = 0;

    if (plan === "3 Months") {
      installmentAmountCalc = remainingAmountCalc / 4; // Correct 3-month plan
    } else if (plan === "6 Months") {
      installmentAmountCalc = remainingAmountCalc / 2; // Correct 6-month plan
    }

    setInstallmentAmount(installmentAmountCalc);
    setRemainingAmount(remainingAmountCalc - installmentAmountCalc);

    console.log("📌 Installment Plan Selected:", plan);
    console.log("📌 Total Fee:", totalFee);
    console.log("📌 Amount Paid So Far:", paidAmount);
    console.log("📌 Installment Amount Calculated:", installmentAmountCalc);
    console.log("📌 Remaining Amount After Payment:", remainingAmountCalc - installmentAmountCalc);
  };

  const handlePaymentSuccess = (paymentResponse) => {
    const storedData = JSON.parse(localStorage.getItem("user"));
    const storedUser = storedData?.user;

    const paymentDetails = {
      name: storedUser.name || "N/A",
      email: storedUser.email || "N/A",
      contact: storedUser.contactNumber || "N/A",
      course: feeDetails?.selectedCourse || "N/A",
      studentClass: feeDetails?.studentClass || "N/A",
      subjects: feeDetails?.subjects?.map((subject) => subject.name).join(", ") || "N/A",
      amountPaid: paymentType === "installment" ? installmentAmount : amount,
      installmentPlan: paymentType === "installment" ? installmentPlan : "Full Payment",
      paymentId: paymentResponse.razorpay_payment_id,
      orderId: paymentResponse.razorpay_order_id,
      date: new Date().toLocaleString(),
    };

    console.log("Before Fee Receipt Download:", paymentDetails);
    setReceiptData(paymentDetails);
  };

  const handlePayment = async () => {
    
    if (!amount || !paymentType) {
      alert("Please fill in all fields.");
      return;
    }

    if (paymentType === "installment" && !installmentPlan) {
      alert("Please select an installment plan.");
      return;
    }

    const storedData = JSON.parse(localStorage.getItem("user"));
    if (!storedData || !storedData.user) {
      alert("User data not found. Please log in again.");
      return;
    }

    const storedUser = storedData.user;
    const latestPayment = userPayments.find(payment => payment.status === "installments_pending");


   // let orderAmount = paymentType === "installment" ? installmentAmount : feeDetails?.fullYearlyFee;
   let orderAmount = paymentType === "installment" 
    ? (latestPayment ? latestPayment.amount : installmentAmount) 
    : (feeDetails?.fullYearlyFee || amount);
    
   if (!orderAmount || orderAmount <= 0) {
     alert("Invalid payment amount. Please check and try again.");
     return;
   }
   
    console.log("🚀 Initiating Payment:");
    console.log("➡ Amount to Pay:", orderAmount);
    console.log("➡ Payment Type:", paymentType);
    console.log("➡ Installment Plan:", installmentPlan);

    if (!orderAmount || isNaN(orderAmount) || orderAmount <= 0) {
      console.error("❌ Error: Invalid amount being sent:", orderAmount);
      alert("Error: Payment amount is invalid. Please check and try again.");
      return;
    }

    try {
      console.log("📤 Creating Order...");
      const paymentData = { 
        amount: orderAmount, 
        paymentType,

    };

    if (paymentType === "installment") {
      paymentData.installmentPlan = installmentPlan;
  }
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/fees/create-order`,
        paymentData,
        { headers: authHeader() }
      );

      if (!response.data || !response.data.orderId) {
        console.error("❌ Error: Invalid order response:", response.data);
        alert("Error: Order creation failed. Please try again.");
        return;
      }

      const { orderId, amount: orderAmountFinal, currency } = response.data;
      console.log("🛒 Order Created:", orderId, orderAmountFinal, currency);

      const options = {
        key: "rzp_test_NSy9AtRvu1CP99",
        amount: orderAmountFinal * 100,
        currency: currency,
        name: "Shreeji Classes",
        description: "Fee Payment",
        order_id: orderId,
        handler: async function (response) {
          console.log("🟢 Payment Successful!", response);
          handlePaymentSuccess(response);
          try {
            const verifyResponse = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/api/fees/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: authHeader() }
            );
  
            if (verifyResponse.data.success) {
              alert("Payment successful!");
              handlePaymentSuccess(response);
            } else {
              console.error("❌ Payment verification failed:", verifyResponse.data);
              alert("Payment verification failed. Please try again.");
            }
          } catch (error) {
            console.error("❌ Payment verification request failed:", error);
            alert("Payment verification request failed. Please contact support.");
          }

        },
        prefill: {
          name: storedUser.name || "",
          email: storedUser.email || "",
          contact: storedUser.contactNumber || "",
        },
        theme: { color: "#2563EB" },
      };

      console.log("🚀 Opening Razorpay Payment Gateway...");
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("❌ Error while creating order:", error);
      alert("Error while creating order, please try again!");
    }
  };
  

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {loading ? (
        <div>Loading user and fee details...</div>
      ) : receiptData ? (
        <Receipt receiptData={receiptData} onBack={() => setReceiptData(null)} />
      ) : userPayments.length > 0 ? (
        // Show payment history if student has paid before
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-3xl font-bold mb-6 text-blue-600">📜 Payment History</h2>
          { userPayments.map((payment, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <p>💰 Amount Paid: ₹{payment.paidAmount}</p>
              <p>📆 Last Payment Date: {new Date(payment.createdAt).toLocaleString()}</p>
              <p>🔹 Payment Type: {payment.paymentType}</p>
              <p>🔸 Installment Plan: {payment.installmentPlan || "N/A"}</p>
              <p>💰 Remaining Amount: ₹{payment.remainingAmount}</p>
              <p>💰 Amount to pay now: ₹{payment.amount}</p>

              <p className="text-gray-700">⚠️ Remaining Installments: {payment.remainingInstallments}</p>
              <p className={`text-${payment.status === "installments_pending" ? "orange" : "green"}-500`}>
              🏷 Status: {payment.status.replace("_", " ").toUpperCase()}
      </p>

            </div>
          ))}
          {userPayments.length > 0 && userPayments[0].status === "completed" ? (
            <h2 className="text-2xl font-bold text-green-600">✅ Fee Paid Completely</h2>
          ) : (
          <button className="mt-6 bg-green text-white py-2 px-4 rounded hover:bg-green-700 w-full" onClick={handlePayment}>
            🚀 Proceed with Next Payment
          </button>)}
        </div>
      ) : feeDetails ? (
        // Show fee details if it's the first payment
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-3xl font-bold mb-6 text-blue-600">💳 Student Fee Payment</h2>
          <div className="mb-4 font-semibold">📖 Course: {feeDetails.selectedCourse}</div>
          <div className="mb-4 font-semibold">🏫 Class: {feeDetails.studentClass}</div>
          <div className="mb-4 font-semibold">📚 Subjects: {feeDetails.subjects.map(subject => subject.name).join(", ")}</div>
          <div className="mb-4 font-semibold text-green-600">💰 Full Year Fee: ₹{feeDetails.fullYearlyFee}</div>
  
          <label className="block font-medium">💵 Payment Type:</label>
          <select className="w-full p-2 mb-4 border rounded" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
            <option value="full">Full Payment</option>
            <option value="installment">Installment Payment</option>
          </select>
  
          {paymentType === "installment" && (
            <>
              <label className="block font-medium">📆 Installment Plan:</label>
              <select className="w-full p-2 mb-4 border rounded" value={installmentPlan} onChange={(e) => handleInstallmentChange(e.target.value)}>
                <option value="">Select Installment Plan</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
              </select>
              <div className="font-semibold text-blue-600">🔹 Current Installment Payment: ₹{installmentAmount}</div>
              <div className="font-semibold text-red-600">🔸 Remaining Amount: ₹{remainingAmount}</div>
            </>
          )}
  
          <button className="mt-6 bg-green text-white py-2 px-4 rounded hover:bg-green-700 w-full" onClick={handlePayment}>
            🚀 Pay Now
          </button>
        </div>
      ) : (
        <div>No fee details found.</div>
      )}
    </div>
  );
  

  
};

export default StudentPayment;
