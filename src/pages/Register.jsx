import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiUserLine,
  RiMailLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiErrorWarningLine,
  RiCheckboxCircleFill
} from 'react-icons/ri';
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import axios from 'axios';
import { URL } from '../url';
import coinleyauth from '../assets/coinley-auth-bg.jpg';
import coinleylogo from '../assets/Logo.png';

const Register = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    password: ''
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await axios.post(`${URL}/api/merchants/register`, formData);
      
      if (response.status === 201 || response.status === 200) {
        setSuccessMessage('Registration successful! Please check your email to verify your account.');
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          businessName: '',
          email: '',
          password: ''
        });
        
        // Redirect to success page after 3 seconds
        setTimeout(() => {
          navigate('/registration-success', { 
            state: { 
              email: formData.email,
              message: 'We\'ve sent a verification link to your email. Please check your inbox and click the link to verify your account.'
            } 
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different error responses
      if (error.response) {
        if (error.response.status === 400 && error.response.data.error === "Email already registered") {
          setErrors({ email: 'This email is already registered' });
        } else {
          setErrors({ 
            submit: error.response.data.error || 'Failed to register. Please try again.' 
          });
        }
      } else {
        setErrors({ submit: 'Network error. Please check your connection and try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className='flex justify-center gap-x-32 items-center'>
        <img src={coinleyauth} className='w-[750px] h-[650px] object-cover rounded-3xl hidden md:block' />

        <div>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* Logo */}
            <div className="mx-auto flex items-center justify-center">
              <span className="text-white"><img src={coinleylogo} className='w-42 object-cover' /></span>
            </div>

            <h2 className="text-center text-3xl font-bold text-gray-900">
              Create your account
            </h2>

            <p className="mt-2 text-center text-sm text-gray-600">
              Start accepting crypto payments for your business
            </p>


            {/* <div className='border h-1 rounded-xl bg-gray-200 mt-4'></div> */}
            <div className='flex justify-between mt-6'>
            <p className='text-gray-500 text-md'>Step 1 of 2</p>
            <p className='text-md text-[#7042D2] font-medium'>Sign Up</p>
            </div>
            <div className='border h-[5px] rounded-xl bg-gradient-to-r from-[#7042D2] from-50% to-gray-200 to-50% mt-2'></div>

          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <RiCheckboxCircleFill className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name Fields */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <RiUserLine className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder='First Name'
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <RiUserLine className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder='Last Name'
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <HiOutlineBuildingOffice className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="businessName"
                      id="businessName"
                       placeholder='e.g Example Ltd'
                      value={formData.businessName}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.businessName ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {errors.businessName && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <RiMailLine className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder='hello@example.com'
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <RiLockLine className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <RiEyeOffLine className="h-5 w-5 text-gray-400" />
                      ) : (
                        <RiEyeLine className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7042D2] hover:bg-[#7042D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {isLoading ? 'Creating account...' : 'Create account'}
                  </button>
                </div>

                {/* General Error Message */}
                {errors.submit && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <RiErrorWarningLine className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {errors.submit}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* Already have an account */}
                <p className="mt-2 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </Link>
                </p>

                {/* Terms and Privacy Policy */}
                <div className="text-sm text-center text-gray-600">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>
                </div>
              </form>
            </div>
          </div>

      
        </div>
      </div>
    </div>
  );
};

export default Register;