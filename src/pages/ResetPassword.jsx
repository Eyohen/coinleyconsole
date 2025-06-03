import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiErrorWarningLine,
  RiCheckboxCircleLine
} from 'react-icons/ri';
import axios from 'axios';
import { URL } from '../url';
import coinleyauth from '../assets/coinley-auth-bg.jpg';
import coinleylogo from '../assets/Logo.png';
import { useDarkMode } from '../context/DarkModeContext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password strength validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Get reset token from localStorage
      const resetToken = localStorage.getItem('resetToken');
      
      if (!resetToken) {
        setError('Reset session expired. Please restart the password reset process.');
        return;
      }
      
      // Configure headers with the reset token
      const config = {
        headers: {
          'x-reset-token': resetToken
        }
      };
      
      // Send the request to reset password
      const res = await axios.post(
        `${URL}/api/merchants/reset-password`, 
        { newPassword: formData.password },
        config
      );

      if (res.status === 200) {
        // Clear token from localStorage
        localStorage.removeItem('resetToken');
        
        setSuccess(true);
        setError('');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      
      if (err.response?.status === 404) {
        setError('Invalid or expired reset token. Please restart the password reset process.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
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
              Reset Your Password
            </h2>
            <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Create a new secure password for your account
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
                        Password reset successful!
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          Your password has been reset successfully. You'll be redirected to the login page shortly.
                        </p>
                      </div>
                      <div className="mt-4">
                        <Link
                          to="/"
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          Back to login
                        </Link>
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
                    {/* New Password Field */}
                    <div>
                      <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        New Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiLockLine className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-10 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Enter new password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <RiEyeOffLine className={`h-5 w-5 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`} />
                          ) : (
                            <RiEyeLine className={`h-5 w-5 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`} />
                          )}
                        </button>
                      </div>
                      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Password must be at least 8 characters
                      </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <label htmlFor="confirmPassword" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Confirm Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiLockLine className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-10 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Confirm new password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <RiEyeOffLine className={`h-5 w-5 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`} />
                          ) : (
                            <RiEyeLine className={`h-5 w-5 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7042D2] hover:bg-[#5a35ac] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                      </button>
                    </div>

                    {/* Back to Login */}
                    <div className="flex items-center justify-center">
                      <div className="text-sm">
                        <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
                          Back to Login
                        </Link>
                      </div>
                    </div>
                  </form>

                  {/* Help Section */}
                  <div className="mt-6">
                    <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Need assistance?{' '}
                      <Link to="/contact" className="font-medium text-blue-600 hover:text-blue-500">
                        Contact Support
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

export default ResetPassword;