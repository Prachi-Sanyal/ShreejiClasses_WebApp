const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes')
const userRoutes = require('./routes/userRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes')
const timetableRoutes= require('./routes/timeTableRoutes');
// const reviewRoutes = require("./routes/reviewRoutes");
const studyMaterialRoutes = require('./routes/studyMaterialRoutes');
//const fileRoutes = require('./routes/fileRoutes'); // Adjust path if needed
const marksRoutes = require("./routes/marksRoutes");

const quizRoutes = require('./routes/quizRoutes');
const checkEmailRoutes = require('./routes/checkEmailRoutes')

const feeRoutes = require('./routes/feeRoutes');

const adminHomeRoutes = require('./routes/adminHomeRoutes');

const adminTaskRoutes = require("./routes/adminTaskRoutes");

const chatbotRoutes = require("./routes/chatbotRoutes");

const courseFrontendRoutes = require("./routes/courseFrontendRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");
const studentEventsRoutes = require("./routes/studentEventsRoutes");
const teacherEventRoutes = require("./routes/teacherEventsRoutes");
const teacherTaskRoutes = require("./routes/teacherTasksRoutes");
const adminEventRoutes = require("./routes/adminEventRoutes");

//require('./cronJobs/overduePayments');


//require('./cronJobs/monthlyReport'); // Make sure to adjust the path


//require('./cronJobs/monthlyPerformance'); // Make sure to adjust the path



dotenv.config();

connectDB();

app.use(express.json());

app.use(cors({origin:process.env.FRONTEND_URL,
  credentials: true,}));



  app.get("/", (req, res) => {
    res.send("Server is running successfully!");
  });


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use('/api/checkEmail', checkEmailRoutes);


app.use('/api/courses', courseRoutes);
app.use('/api', inquiryRoutes); 



app.use('/api/attendance',attendanceRoutes)
app.use('/api/timetable', timetableRoutes)
app.use('/api/marks', marksRoutes); //  Yeh routes API ke under aayenge


 //  app.use("/api/reviews", reviewRoutes);
app.use('/api/materials', studyMaterialRoutes);


//app.use('/api/files', fileRoutes);
app.use('/api/quiz', quizRoutes);


app.use('/api/notifications', notificationRoutes);


app.use('/api/fees', feeRoutes);


app.use("/api/stats", adminHomeRoutes);
app.use("/api/tasks", adminTaskRoutes);
app.use("/api/adminEvents", adminEventRoutes);


app.use("/api/chatbot", chatbotRoutes);

app.use("/api/front", courseFrontendRoutes);

app.use("/api/studentDashboard", studentDashboardRoutes);
app.use("/api/studentevents", studentEventsRoutes);

app.use("/api/teacherEvents", teacherEventRoutes);
app.use("/api/teacherTasks", teacherTaskRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
