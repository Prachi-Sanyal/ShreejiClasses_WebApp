import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(300);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verifyOtp`, { email, otp: otpString });
      toast.success('Congratulations! You are successfully registered and can now log in.');

      setTimeout(() => {
        navigate('/login'); 
      }, 1000);
    } catch (error) {
      toast.error('Invalid OTP, please try again!');
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/resendOtp`, { email });
      toast.success('OTP resent successfully!');
      setSeconds(300);
      setIsResendEnabled(false);
    } catch (error) {
      toast.error('Failed to resend OTP, please try again!');
    }
  };

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [seconds]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const sec = time % 60;
    return `${minutes}:${sec < 10 ? `0${sec}` : sec}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">

        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              value={email || ''}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-200 text-gray-700"
            />
          </div>
          <div className="flex space-x-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                className={`w-12 h-12 text-center text-2xl border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                  digit ? 'border-orange' : 'border-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center text-sm">
            <p>{seconds > 0 ? `Resend OTP in ${formatTime(seconds)}` : ''}</p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!isResendEnabled}
              className={`text-blue-500 ${!isResendEnabled ? 'cursor-not-allowed' : ''}`}
            >
              Resend OTP
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-orange text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300 mt-4"
          >
            Verify OTP
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default VerifyOtp;
