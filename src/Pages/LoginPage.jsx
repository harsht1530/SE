import React, { useState,useRef ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice.js"
import { getAssetPath } from '../utils/imageUtils';
import CryptoJS from "crypto-js";
import apiService from "../services/api.js";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const secretKey = import.meta.env.VITE_TOKEN_SECRET

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    department: ''
  });
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [otp,setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); 
  const [canResend, setCanResend] = useState(false);

  // Add timer effect
  useEffect(() => {
    let interval;
    if (showOtpInput && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOtpInput, timer]);

  const handleGenerateOtp = async (e) => {
    console.log("handler for generating the otp was called ")
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await apiService.auth.generateOtp(formData.email);
      if (response.success) {
        setShowOtpInput(true);
        setTimer(300); // Reset timer
        setCanResend(false);
        toast.success('OTP sent to your email');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      setIsLoading(true);
      setOtp(['', '', '', '', '', '']);
      const response = await apiService.auth.generateOtp(formData.email);
      if (response.success) {
        setTimer(300); // Reset timer
        setCanResend(false);
        toast.success('New OTP sent to your email');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Add this helper function
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const encryptToken = (token,secretKey)=>{
    const encryptedToken = CryptoJS.AES.encrypt(token,secretKey).toString();
    return encryptedToken;
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await apiService.auth.verifyOtp(formData.email, formData.otp);
      
      if (response?.token) {
        dispatch(addUser({
          email: formData.email,
          role: response.user.role,
          companyId: response.user.companyId,
          permissions: response.user?.permissions || null,
         
        }));
        
         const encryptedToken = encryptToken(response.token,secretKey);
        localStorage.setItem("authToken", encryptedToken);
        localStorage.setItem("userEmail",response.user.email)
        toast.success("Login successful");
        setTimeout(() => navigate('/newsFeed'), 500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check the OTP you entered');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {

  if (!/^\d$/.test(value)) return;
  
  if (value.length > 1) return;
  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);
  setFormData({ ...formData, otp: newOtp.join('') });

  if (value && index < 5) {
    inputRefs.current[index + 1].focus();
  }
};

useEffect(() => {
  if (showOtpInput && inputRefs.current[0]) {
    inputRefs.current[0].focus();
  }
}, [showOtpInput]);


const handleKeyDown = (index, e) => {
  if (e.key === 'Backspace') {
    e.preventDefault();
    const newOtp = [...otp];
    newOtp[index] = '';
    setOtp(newOtp);
    setFormData({ ...formData, otp: newOtp.join('') });
    
    if (index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }
  else if(e.key === 'ArrowLeft' && index > 0){
    e.preventDefault();
    inputRefs.current[index - 1].focus();

  }
  else if (e.key === 'ArrowRight' && index < 5) {
    e.preventDefault();
    inputRefs.current[index + 1].focus();
  }
};

// Update input type in the render section
{showOtpInput && (
  <div>
    <label className="block text-gray-700 mb-2">One Time Passcode</label>
    <div className="flex gap-2 justify-between">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="tel"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080]"
          value={otp[index]}
          onChange={(e) => handleOtpChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          required
        />
      ))}
    </div>
  </div>
)}

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
        <div className="bg-white p-8 rounded-lg shadow-lg w-120">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          
          <form onSubmit={showOtpInput ? handleVerifyOtp : handleGenerateOtp} className="space-y-4">
            {/* <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080]"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Department</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080]"
                placeholder="Enter your department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div> */}

            <div>
              <label className="block text-gray-700 mb-2">Company Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080]"
                placeholder="your.name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {showOtpInput && (
              <div>
                <label className="block text-gray-700 mb-2">One Time Passcode</label>
                <div className="flex gap-2 justify-between">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800080]"
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      required
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-32 bg-[#800080] text-white py-2 rounded-lg hover:opacity-90 transition"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                ) : showOtpInput ? (
                  'Verify & Login'
                ) : (
                  'Generate OTP'
                )}
              </button>
            </div>


             <div className="mt-4 text-center">
          {timer > 0 ? (
            <p className="text-gray-600">Resend OTP in {formatTime(timer)}</p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || isLoading}
              className="text-[#800080] hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          )}
        </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
