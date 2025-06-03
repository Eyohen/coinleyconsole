import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../url';
import { 
  RiMailSendLine,
  RiMailCheckLine,
  RiHome2Line, 
  RiRefreshLine, 
  RiErrorWarningLine,
  RiCheckboxCircleFill
} from 'react-icons/ri';
import coinleylogo from '../assets/Logo.png';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state (passed from registration page)
  const email = location.state?.email || '';
  const message = location.state?.message || 'We\'ve sent a verification link to your email. Please check your inbox and click the link to verify your account.';
  
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');
  
  // Handle resend verification email
  const handleResendVerification = async () => {
    if (!email) {
      setResendError('Email address is missing. Please try registering again.');
      return;
    }
    
    setIsResending(true);
    setResendError('');
    
    try {
      const response = await axios.post(`${URL}/api/merchants/resend-verification`, {
        email
      });
      
      if (response.data && response.data.success) {
        setResendSuccess(true);
      } else {
        throw new Error('Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      
      if (error.response && error.response.data) {
        setResendError(error.response.data.error || 'Failed to resend verification email. Please try again.');
      } else {
        setResendError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={coinleylogo} className="h-12 object-contain" alt="Coinley Logo" />
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <RiMailSendLine className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          
          <p className="mt-2 text-sm text-gray-600 mb-6">
            {message}
          </p>
          
          {email && (
            <div className="bg-gray-50 rounded-md p-4 mb-6 inline-block">
              <p className="text-sm font-medium text-gray-700">
                Email: <span className="text-gray-900">{email}</span>
              </p>
            </div>
          )}
          
          {/* Resend verification email */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Didn't receive the email?</h3>
            
            {resendSuccess ? (
              <div className="rounded-md bg-green-50 p-3 mb-4">
                <div className="flex">
                  <RiCheckboxCircleFill className="h-5 w-5 text-green-400" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-green-800">
                      Verification email has been resent. Please check your inbox.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#7042D2] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2] disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Resending...</span>
                  </>
                ) : (
                  <>
                    <RiRefreshLine className="mr-2" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>
            )}
            
            {resendError && (
              <div className="mt-3 rounded-md bg-red-50 p-3">
                <div className="flex">
                  <RiErrorWarningLine className="h-5 w-5 text-red-400" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-red-800">
                      {resendError}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-4">
              After verifying your email, you'll be able to log in to your account.
            </p>
            
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2]"
            >
              <RiHome2Line className="mr-2" />
              Go to Login
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          If you continue to have issues, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;