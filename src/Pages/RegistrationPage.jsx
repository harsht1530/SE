import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiService from '../services/api';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    department: 'operations',
    profilePic: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const departments = [
    { value: 'operations', label: 'Operations' },
    { value: 'medical', label: 'Medical' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('department', formData.department);
      if (formData.profilePic) {
        formDataToSend.append('profilePic', formData.profilePic);
      }

      const response = await apiService.auth.register(formDataToSend);
      
      if (response.status === 'pending' && response.userId) {
        // Store userId temporarily if needed for future reference
        sessionStorage.setItem('pendingRegistrationId', response.userId);
        
        toast.success(response.message || 'Registration successful! Waiting for admin approval.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.code === 'INVALID_DOMAIN' 
        ? 'This email domain is not registered with us'
        : error.response?.data?.message || 'Registration failed';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen">
      <ToastContainer />
      <div className="w-[50%] bg-[#800080] h-[100vh] flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
        <img src="https://res.cloudinary.com/dhtdkkae1/image/upload/v1745845262/9319774_4136934_ilofsq.png" alt="logo" className="w-120 h-120 object-contain"/>
        <h1 className="text-white font-semibold text-4xl">Advancing healthcare,</h1>
        <h1  className="text-white font-semibold text-4xl pt-1.5">one discovery at a time</h1>

        </div>
        
      </div>

      <div className="w-[50%] flex justify-center items-center bg-[#F5F5F5]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-120 my-2">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Company Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080]"
                placeholder="your.name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={formData.showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080]"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setFormData({...formData, showPassword: !formData.showPassword})}
                >
                  {!formData.showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={formData.showConfirmPassword?"text":"password"}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080]"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setFormData({...formData, showConfirmPassword: !formData.showConfirmPassword})}
                >
                  {!formData.showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Department</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080]"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                {departments.map(dept => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => setFormData({...formData, profilePic: e.target.files[0]})}
              />
            </div>
            <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#800080] text-white py-2 rounded-lg hover:opacity-90 transition w-20"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : (
                'Register'
              )}
            </button>
            </div>

            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#800080] hover:underline"
              >
                Login here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;