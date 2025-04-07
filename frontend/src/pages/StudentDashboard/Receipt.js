



  
  import React from "react";
import { jsPDF } from "jspdf";
import logo from "../../assets/img/logo.png"; // Adjust path
import signature from "../../assets/img/signature.png"; // Adjust path

const Receipt = ({ receiptData, onBack }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Function to load image as Base64
    const loadImage = (src, callback) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // To avoid CORS issues
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        callback(dataURL);
      };
    };

    // Load Logo First
    loadImage(logo, (logoBase64) => {
      doc.addImage(logoBase64, "PNG", 60, 10, 90, 30); // Logo centered

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Shreeji Classes", 20, 40);
      doc.setFontSize(12);
      doc.text("Payment Receipt", 20, 50);
      doc.line(20, 52, 190, 52); // Horizontal line

      // Receipt Details
      doc.setFont("helvetica", "normal");
      let yPosition = 65;
      Object.entries(receiptData).forEach(([key, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${key}:`, 20, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(`${value}`, 80, yPosition);
        yPosition += 10;
      });

      // Load Signature Next
      loadImage(signature, (signatureBase64) => {
        doc.line(20, yPosition + 10, 190, yPosition + 10); // Line before signature
        doc.setFontSize(10);
        doc.text("Authorized Signatory", 140, yPosition + 30);
        doc.addImage(signatureBase64, "PNG", 140, yPosition + 35, 40, 20); // Signature image

        // Save PDF after both images are loaded
        doc.save(`Fee_Receipt_${receiptData.name}.pdf`);
      });
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-green-600">✅ Payment Successful</h2>
      <p>📌 Name: {receiptData.name}</p>
      <p>📧 Email: {receiptData.email}</p>
      <p>📞 Contact: {receiptData.contact}</p>
      <p>📖 Course: {receiptData.course}</p>
      <p>🏫 Class: {receiptData.studentClass}</p>
      <p>📚 Subjects: {receiptData.subjects}</p>
      <p>💰 Amount Paid: ₹{receiptData.amountPaid}</p>
      <p>🟢 Remaining Amount: ₹{receiptData.remainingAmount}</p>
      <p>📆 Next Due Date: {receiptData.nextDueDate}</p>
      <p>🔢 Remaining Installments: {receiptData.remainingInstallments}</p>
      <p>📑 Installment Plan: {receiptData.installmentPlan}</p>
      <p>📄 Payment ID: {receiptData.paymentId}</p>
      <p>🆔 Order ID: {receiptData.orderId}</p>
      <p>📅 Date: {receiptData.date}</p>
      <button className="mt-4 bg-orange text-white px-4 py-2 rounded" onClick={downloadPDF}>
        📥 Download Receipt
      </button>
      <button className="mt-4 bg-green text-white px-4 py-2 rounded" onClick={onBack}>
        🔙 Back
      </button>
    </div>
  );
};

export default Receipt;


