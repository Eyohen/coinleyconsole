import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiErrorWarningLine,
  RiCheckboxCircleLine,
  RiTimer2Line
} from 'react-icons/ri';
import axios from 'axios';
import { URL } from '../url';
import coinleyauth from '../assets/coinley-auth-bg.jpg';
import coinleylogo from '../assets/Logo.png';
import { useDarkMode } from '../context/DarkModeContext';

const OtpVerification = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  
  // Get email from localStorage
  const [email, setEmail] = useState('');
  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email in storage, redirect back to forgot password
      navigate('/forgot-password');
    }
  }, [navigate]);
  
  // OTP state
  const otpLength = 4;
  const inputRefs = useRef([]);
  
  // Initialize refs array for OTP inputs
  useEffect(() => {
    inputRefs.current = Array(otpLength).fill(null).map((_, i) => inputRefs.current[i] || React.createRef());
  }, []);
  
  const [otp, setOtp] = useState(Array(otpLength).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Start countdown for resend option (60 seconds)
  useEffect(() => {
    setCountdown(60);
  }, []);
  
  // Handle countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Clear error when user types
    setError('');
    
    // Auto-focus next input if value is entered
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Handle key down event (for backspace navigation)
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is numeric and matches OTP length
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, otpLength);
      setOtp(newOtp);
      
      // Focus the last input
      if (newOtp.length === otpLength) {
        inputRefs.current[otpLength - 1].focus();
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if OTP is complete
    const otpValue = otp.join('');
    if (otpValue.length !== otpLength) {
      setError('Please enter the complete verification code');
      return;
    }
    
    setIsLoading(true);
    try {
      // Get reset token from localStorage
      const resetToken = localStorage.getItem('resetToken');
      
      if (!resetToken) {
        setError('Your reset session has expired. Please start again.');
        setTimeout(() => {
          navigate('/forgot-password');
        }, 2000);
        return;
      }
      
      // Configure headers with the reset token
      const config = {
        headers: {
          'x-reset-token': resetToken
        }
      };
      
      // Call the verify-otp API
      const response = await axios.post(
        `${URL}/api/merchants/verify-otp`,
        { otp: otpValue },
        config
      );
      
      if (response.status === 200) {
        setSuccess(true);
        
        // Redirect to reset password page after a short delay
        setTimeout(() => {
          navigate('/reset-password');
        }, 2000);
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      if (err.response?.status === 400) {
        setError('Invalid verification code. Please try again.');
      } else if (err.response?.status === 404) {
        setError('Invalid or expired session');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${URL}/api/merchants/forgot-password`, { email });
      
      if (response.status === 200) {
        // Update token if provided
        if (response.data.resetToken) {
          localStorage.setItem('resetToken', response.data.resetToken);
        }
        
        setError('');
        setSuccess(false); // Reset success state
        setOtp(Array(otpLength).fill('')); // Clear OTP fields
        
        // Reset countdown
        setCountdown(60);
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
      <div className='flex justify-center gap-x-32'>
        <img src={coinleyauth} className='w-[750px] h-[650px] object-cover rounded-3xl hidden md:block' alt="Authentication background" />

        <div>
          <div className="sm:mx-auto sm:w-full sm:max-w-md w-full">
            {/* Logo */}
            <div className="mx-auto flex items-center justify-center">
              <img src={coinleylogo} className='w-42 object-cover' alt="Coinley logo" />
            </div>

            <h2 className={`mt-6 text-center text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Verification Code
            </h2>
            <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Enter the verification code sent to{' '}
              <span className="font-medium">{email || 'your email'}</span>
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-8 px-4 sm:rounded-lg sm:px-10 shadow-xl md:w-[450px]`}>
              {/* Success Message */}
              {success ? (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <RiCheckboxCircleLine className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Verification successful!
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          Code verified successfully. Redirecting you to reset your password...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <RiErrorWarningLine className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            {error}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* OTP Input Fields */}
                    <div>
                      <label htmlFor="otp-1" className="sr-only">Verification code</label>
                      <div className="flex items-center justify-center space-x-3">
                        {Array.from({ length: otpLength }).map((_, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={otp[index]}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className={`w-14 h-14 text-center text-xl font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            required
                          />
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7042D2] hover:bg-[#5a35ac] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                      </button>
                    </div>

                    {/* Resend Code */}
                    <div className="flex items-center justify-center">
                      <div className="text-sm">
                        {countdown > 0 ? (
                          <span className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <RiTimer2Line className="mr-1" />
                            Resend code in {countdown}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            className="font-medium text-blue-600 hover:text-blue-500"
                          >
                            Didn't receive a code? Resend
                          </button>
                        )}
                      </div>
                    </div>
                  </form>

                  {/* Back to Login */}
                  <div className="mt-6">
                    <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
                        Back to Login
                      </Link>
                    </p>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;