import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileEdit = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    parentContactNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserData(response.data.user);
      } catch (err) {
        toast.error('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to update your profile?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/edit-profile/${userData._id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success(response.data.msg);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6 || !/\d/.test(newPassword)) {
      toast.error('Password must be at least 6 characters long and contain at least one digit.');
      return;
    }

    if (!window.confirm('Are you sure you want to change your password?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/change-password/${userData._id}`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success(response.data.msg);
      setChangePasswordMode(false); 
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="contactNumber">
            Contact Number
          </label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={userData.contactNumber}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {userData.role === 'student' && (
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="parentContactNumber">
              Parent Contact Number
            </label>
            <input
              type="text"
              id="parentContactNumber"
              name="parentContactNumber"
              value={userData.parentContactNumber}
              onChange={handleChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 mt-2 bg-orange text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>

        {!changePasswordMode ? (
          <button
            type="button"
            onClick={() => setChangePasswordMode(true)}
            className="w-full p-2 mt-2 bg-green text-white rounded-md hover:bg-blue-700"
          >
            Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="oldPassword">
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="newPassword">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full p-2 mt-2 bg-orange text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProfileEdit;
