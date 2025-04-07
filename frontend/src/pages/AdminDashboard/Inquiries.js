import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './ButtonStyle.css';
import { FaReply, FaEnvelope, FaWhatsapp, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Importing icons

const Inquiries = () => {
  const [enquiryList, setEnquiryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/inquiries`)
      .then((response) => {
        setEnquiryList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching enquiries:", error);
      });
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setEnquiryList((prevList) =>
      prevList.map((enquiry) =>
        enquiry._id === id ? { ...enquiry, status: newStatus } : enquiry
      )
    );
    axios
    .put(`${process.env.REACT_APP_BACKEND_URL}/api/inquiries/${id}/status`, { status: newStatus })
    .then((response) => {
      toast.success("Status updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating status:", error);
      toast.error("Error updating status.");
    });
};

const handleDelete = (id) => {
    setEnquiryList((prevList) => prevList.filter((enquiry) => enquiry._id !== id));
  
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/api/inquiries/${id}`)
      .then((response) => {
        toast.success("Enquiry deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting enquiry:", error);
        toast.error("Error deleting enquiry.");
      });
  };
  


  const handleRespond = async (id, mode, contactNumber, status) => {
    if (status === "resolved") {
      toast.info("You have already responded to this inquiry.");
      return;
    }
  
    if (mode === "call") {
      window.location.href = `tel:${contactNumber}`;  
    } else {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/inquiries/${id}/respond`);
        if (response.data && response.data.message) {
          toast.success("Response has been sent successfully.");
        } else {
          toast.success("Response sent successfully!");
        }
      } catch (error) {
        console.error("Error responding to inquiry:", error);
        const errorMessage = error.response?.data?.error || "Error processing the response.";
        toast.error(errorMessage);
      }
    }
  };
  
  
  
  

  const renderInquiries = () => {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Enquiries</h2>

        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by contact number or email"
            className="p-2 w-full border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white shadow-md">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left border-b">Contact Number</th>
                <th className="py-2 px-4 text-left border-b">Email</th>
                <th className="py-2 px-4 text-left border-b">Enquiry Mode</th>
                <th className="py-2 px-4 text-left border-b">Status</th>
                <th className="py-2 px-4 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiryList
                .filter(
                  (enquiry) =>
                    enquiry.contactNumber.includes(searchQuery) ||
                    enquiry.email.includes(searchQuery)
                )
                .map((enquiry) => (
                  <tr key={enquiry._id}>
                    <td className="py-2 px-4 border-b">{enquiry.contactNumber}</td>
                    <td className="py-2 px-4 border-b">{enquiry.email}</td>
                    <td className="py-2 px-4 border-b">{enquiry.enquiryMode}</td>

                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          enquiry.status === "pending"
                            ? "button-pending"
                            : "button-success"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b flex gap-2 items-center">

                      


<button
  className="button-primary flex items-center gap-1 px-2 py-1 text-sm"
  onClick={() => handleRespond(enquiry._id, enquiry.enquiryMode, enquiry.contactNumber, enquiry.status)}
>
  <FaReply className="inline-block mr-2 text-xs" />
  Respond
</button>


                      <button
                        className="bg-orange text-white px-2 py-1 text-sm rounded-md whitespace-nowrap"
                        onClick={() => handleStatusChange(enquiry._id, "resolved")}
                        disabled={enquiry.status === "resolved"}
                      >
                        Mark as Resolved
                      </button>
                      <button
                        className="button-danger flex items-center px-2 py-1"
                        onClick={() => handleDelete(enquiry._id)}
                      >
                        <FaTrash className="inline-block mr-1 text-xs" />
                        
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between ">
          <button className="button-pagination ">
           Previous
          </button>
          <button className="button-pagination ">
            Next 
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderInquiries()}
      <ToastContainer />
    </div>
  );
};

export default Inquiries;
