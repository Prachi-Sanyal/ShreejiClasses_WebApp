import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import loginImage from '../assets/img/login.png'; 

const Login = () => {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in both email and password.', { autoClose: 3000 });
      return;
    }

    
    if (!validateEmail(email)) {
      toast.error('Invalid email format.', { autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('email', response.data.email);
      
       

        toast.success('Login successful!', { autoClose: 1000 }); 

        setTimeout(() => {
          if (response.data.role === 'admin') {
            navigate('/admin-dashboard');
          } else if (response.data.role === 'teacher') {
            navigate('/teacher-dashboard');
          } else {
            navigate('/student-dashboard');
          }
        }, 2000); 
      }
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
  
      if (err.response) {
        if (err.response.data && err.response.data.msg) {
          errorMessage = err.response.data.msg;  
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';  
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Check your network connection.';
      } else {
        errorMessage = 'An error occurred. Please try again.';
      }
  
      setError(errorMessage);
      toast.error(errorMessage, { autoClose: 3000 });
    }
  };
  
  return (
    <div>
      <ToastContainer />
      <div className="min-h-screen flex justify-center items-center bg-gray-100 mt-20 ml-16 mr-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl">
          
          <div className="hidden lg:block">
            <img src={loginImage} alt="Login" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col justify-center bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-center text-3xl font-semibold mb-6">Login</h2>

            {error && <div style={{ color: 'red' }} className="text-sm mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>

            <div className="mt-4">
              <Link to="/forgot-password" style={{ color: 'gray' }} className="hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
