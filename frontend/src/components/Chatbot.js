import React, { useState } from "react";
import axios from "axios";
import { FaRobot } from "react-icons/fa";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]); // Stores chat history

    // Toggle Chatbot Window
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    // Send User Message to Chatbot API
    const sendMessage = async () => {
        if (!message) return;

        const userMessage = { sender: "user", text: message };
        setMessages([...messages, userMessage]);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chatbot/ask`, { message });
            const botMessage = { sender: "bot", text: response.data.reply }; // Match with backend response
            setMessages([...messages, userMessage, botMessage]); // Append chat history
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
        }

        setMessage(""); // Clear input
    };

    return (
        <>
            {/* Floating Chatbot Icon */}
            <div 
                className="fixed bottom-5 right-5 text-white w-14 h-14 flex items-center justify-center rounded-full cursor-pointer shadow-lg"
                style={{ backgroundColor: "#5c9eff" }} // Light Blue
                onClick={toggleChat}
            >
                <FaRobot className="text-3xl" />
            </div>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-5 w-80 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    
                    {/* Header */}
                    <div className="p-3 flex justify-between items-center"
                        style={{ backgroundColor: "#5c9eff", color: "white" }} // Light Blue Header
                    >
                        <h3 className="text-lg font-semibold">Shreeji Classes Chatbot</h3>
                        <button 
                            className="text-white text-2xl hover:text-gray-200"
                            onClick={toggleChat}
                        >
                            &times;
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-3 max-h-72 overflow-y-auto flex flex-col gap-2">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className="p-2 rounded-lg text-white max-w-3/4"
                                style={{
                                    backgroundColor: msg.sender === "user" ? "#0077cc" : "#5c9eff", // User: Darker Blue, Bot: Light Blue
                                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                    textAlign: msg.sender === "user" ? "right" : "left"
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input Field & Button */}
                    <div className="p-3 border-t flex gap-2">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask about courses, fees, etc..."
                        />
                        <button 
                            className="text-white px-4 py-2 rounded-lg hover:opacity-80"
                            style={{ backgroundColor: "#0077cc" }} // Darker Blue Send Button
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
