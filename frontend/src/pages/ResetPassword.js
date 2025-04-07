import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';  

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-password/${token}`, { password });
            toast.success(response.data.message); 

            setTimeout(() => {
                navigate('/login');  
            }, 2000);  
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong'); 
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
                
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}  
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <span 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute top-1/3 right-3 transform -translate-y-1/2 cursor-pointer"
                    >
                        {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />} 
                    </span>
                </div>

                <button type="submit" className="w-full bg-orange text-white py-2 rounded">Reset</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default ResetPassword;
