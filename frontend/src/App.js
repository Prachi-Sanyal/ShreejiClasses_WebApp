
import React from 'react'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; 
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import ContactFrontend from './pages/ContactFrontend';
import Blogs from './pages/Blogs';
import Header from './components/Header';
import Footer from './components/Footer';
import CourseFrontend from './pages/CourseFrontend';
import CourseDetail from './pages/CourseDetail';
import DetailedBlogPage from './pages/DetailedBlogPage';
import Login from './pages/Login'; 
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import SignupForm from './pages/SignupForm';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboardTrial from './pages/AdminDashboardTrial';
import StudentDashboardTrial from './pages/StudentDashboardTrial';
import TeacherDashboardTrial from './pages/TeacherDashboardTrial';
import Chatbot from './components/Chatbot';


function App() {
  return (
    <Router> 
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  const hideHeaderRoutes = ['/admin-dashboard', '/teacher-dashboard', '/student-dashboard', '/admin-design', '/student-design','/teacher-design'];
  const hideFooterRoutes= hideHeaderRoutes;

  return (
    <div className="App">
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      
      
      
      <Routes> 
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/about" element={<AboutUs />} /> 
       <Route path="/coursefrontend" element={<CourseFrontend />} />
        <Route path="/coursedetails/:courseId" element={<CourseDetail />} />
        <Route path="/blogs" element={<Blogs />} />  
        <Route path="/contact" element={<ContactFrontend />} />  
        
        <Route path="/blogs/:id" element={<DetailedBlogPage />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/verifyOtp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin-design" element={<AdminDashboardTrial />}/>
        <Route path="/student-design" element={<StudentDashboardTrial />}/>
        <Route path="/teacher-design" element={<TeacherDashboardTrial />}/>

      </Routes>
      
      <Chatbot />
      
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;
