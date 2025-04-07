const nodemailer = require("nodemailer");
const twilio = require("twilio");
const Inquiry = require("../models/Inquiry");
const dotenv = require('dotenv');
dotenv.config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioNumber = process.env.TWILIO_PHONE;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.respondToInquiry = async (id) => {
  const inquiry = await Inquiry.findById(id);
  if (!inquiry) throw new Error("Inquiry not found");

  switch (inquiry.enquiryMode) {
    case "call":
      console.log(`Calling ${inquiry.contactNumber}...`);
      return { message: `Calling ${inquiry.contactNumber}` };

    case "email":
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: inquiry.email,
        subject: "Response to Your Inquiry",
        text: `Thank you for reaching out! We appreciate your interest in our courses. Below are the course options we offer, along with the fees structure:

    1. **Grade 6-10 Courses**:
       - **Subjects Included**: Math, Science, English, Social Studies, and more.
       - **Total Course Fees (All Subjects)**: ₹20,000
       - If you're interested in specific subjects, the fees will differ as follows:
         - Math: ₹5,000
         - Science: ₹5,000
         - English: ₹4,000
         - Social Studies: ₹3,000
       - Duration: 1 year
       - Weekly tests and assignments to reinforce learning.

    2. **Grade 11-12 Science Courses**:
       - **Subjects Included**: Physics, Chemistry, Mathematics, Biology.
       - **Total Course Fees (All Subjects)**: ₹35,000
       - For individual subjects, the fees are:
         - Physics: ₹8,000
         - Chemistry: ₹8,000
         - Mathematics: ₹10,000
         - Biology: ₹9,000
       - Duration: 1 or 2 years (depending on the class).
       - Prepares students for competitive exams and university admissions.

    3. **JEE/NEET/GUJCET Preparation**:
       - **Total Course Fees**: ₹40,000
       - If you're interested in specific subjects (Physics, Chemistry, Mathematics), the fees will be:
         - Physics: ₹12,000
         - Chemistry: ₹12,000
         - Mathematics: ₹12,000
       - Duration: Flexible (short-term or long-term courses).
       - Intensive focus on preparing for engineering and medical entrance exams.

    4. **SOF Olympiad Courses**:
       - **Subjects Included**: Mathematics, Science, English Olympiad.
       - **Total Course Fees (All Subjects)**: ₹15,000
       - For specific subjects:
         - Mathematics: ₹6,000
         - Science: ₹5,000
         - English: ₹4,000
       - Duration: 1 year.
       - Designed to build analytical skills and prepare for Olympiad exams.

    **Important Notes**:
    - If you're interested in selecting specific subjects, please let us know, and we will provide you with an adjusted fees structure based on your selection.
    - The fees mentioned are for the full course duration, but we also offer payment plans if required.

    Please let us know which course and subjects you are most interested in so that we can finalize the details for you. Feel free to reach out for any further queries!

    We look forward to hearing from you soon!

    Best regards,
    Shreeji Classes
    +91 96876 21805`,
      };

      await transporter.sendMail(mailOptions);
      return { message: `Email sent to ${inquiry.email}` };

    {/*
        case "in-person":
      await twilioClient.messages.create({
        body: `Please visit us at your convenience. Let us know the time that works for you.`,
        from: `whatsapp:${twilioNumber}`,
        to: `whatsapp:${inquiry.contactNumber}`,
      });
      return { message: `WhatsApp message sent to ${inquiry.contactNumber}` };
*

case "in-person":
    try {
        console.log("Attempting to send WhatsApp message...");
        const message = await twilioClient.messages.create({
          body: `Please visit us at your convenience. Let us know the time that works for you.`,
          from: `whatsapp:${twilioNumber}`,
          to: `whatsapp:${inquiry.contactNumber}`,
        });
        console.log("Twilio Message Response:", message);
        return { message: `WhatsApp message sent to ${inquiry.contactNumber}` };
      } catch (error) {
        console.error("Twilio Error:", error);
        return { error: "Failed to send WhatsApp message" };
      }

      */}

      case "in-person":
        try {
            
            const formattedNumber = inquiry.contactNumber.startsWith("+91") 
              ? inquiry.contactNumber 
              : `+91${inquiry.contactNumber}`;
          
            const message = await twilioClient.messages.create({
              body: `Thank you for reaching out to us. Our working hours are Monday to Saturday, from 3:00 PM to 8:00 PM. You are welcome to visit us at your convenience during these hours.

    Please let us know a time that works for you, and we'll be happy to assist you further.

    Feel free to reach out if you have any questions or need additional information. You can contact us anytime, and we'll be glad to help!
`,
              from: process.env.TWILIO_PHONE,  
              to: formattedNumber, 
            });
          
            return { message: `SMS sent to ${formattedNumber}` };
          } catch (error) {
            console.error("Twilio SMS Error:", error);
            return { error: "Failed to send SMS" };
          }
          
    default:
      throw new Error("Invalid enquiry mode");
  }
};
