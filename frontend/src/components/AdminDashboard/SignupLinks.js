import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SignupLinks = () => {
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("");

  const sendSignupLinks = async () => {
    if (!emails.trim() || !message.trim()) {
      toast.error("Please fill out both fields.");
      return;
    }

    const emailList = emails.split(",").map((email) => email.trim()).join(",");
    const isValid = emailList.split(",").every((email) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    );

    if (!isValid) {
      toast.error("Please provide a valid comma-separated list of emails.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/send-signupLinks`,
        { emails: emailList, message },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Signup links sent successfully!");
      setEmails("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send signup links. Please try again.");
    }
  };

  return (
    <div>
      <h1>Send Signup Links</h1>
      <textarea
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        placeholder="Enter emails (comma-separated)"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={sendSignupLinks}>Send</button>
    </div>
  );
};

export default SignupLinks;
