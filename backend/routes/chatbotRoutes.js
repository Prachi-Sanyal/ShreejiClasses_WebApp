const express = require("express");
const router = express.Router();

const qa_pairs = [
    { keywords: ["class", "timing"], response: "Our classes run from 8 AM to 8 PM. Please check the schedule for specific subjects." },
    { keywords: ["fees", "structure"], response: "The fees depend on the course you choose. Contact us for more details." },
    { keywords: ["admission", "process"], response: "To enroll, visit our office or fill out the online admission form on our website." },
    { keywords: ["subjects", "courses"], response: "We offer coaching for Mathematics, Science, English, and various competitive exams." },
    { keywords: ["online", "classes"], response: "No, we offer only offline classes." },
    { keywords: ["faculty", "teachers"], response: "Our faculty includes experienced teachers with expertise in their respective subjects." },
    { keywords: ["study", "materials"], response: "We provide high-quality study materials and notes to enrolled students." },
    { keywords: ["test", "exams"], response: "Regular tests and mock exams are conducted to help students prepare better." },
    { keywords: ["performance", "tracking"], response: "Parents and students can track performance through our online portal." },
    { keywords: ["contact", "support"], response: "For inquiries, call us at +91-XXXXXXXXXX or email us at support@shreejiclasses.com." },
];

// Function to handle chatbot queries
const chatbot = (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    
    let response = "Sorry, I don't understand your question. Can you please rephrase it?";
    
    // Match keywords using regex
    for (const pair of qa_pairs) {
        const regex = new RegExp(pair.keywords.join('|'), 'i');
        if (regex.test(userMessage)) {
            response = pair.response;
            break;
        }
    }

    res.json({ reply: response });
};

// Route to handle chatbot queries
router.post("/ask", chatbot);

// Seed database (if needed later)
router.post("/seed", async (req, res) => {
    // This is only needed if you want to save questions in a database in the future.
    res.json({ message: "Chatbot data seeded!" });
});

module.exports = router;
