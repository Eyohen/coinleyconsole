// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   RiMailLine,
//   RiErrorWarningLine,
//   RiCheckboxCircleLine
// } from 'react-icons/ri';
// import axios from 'axios';
// import { URL } from '../url';
// import coinleyauth from '../assets/coinley-auth-bg.jpg';
// import coinleylogo from '../assets/Logo.png';
// import { useDarkMode } from '../context/DarkModeContext';

// const ForgotPassword = () => {
//   const navigate = useNavigate();
//   const { darkMode } = useDarkMode();
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const handleChange = (e) => {
//     setEmail(e.target.value);
//     setError(''); // Clear error when user types
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!email) {
//       setError('Please enter your email address');
//       return;
//     }

//     // Email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Add your password reset API call here
//       const res = await axios.post(`${URL}/api/merchants/forgot-password`, { email }, {
//         timeout: 50000,
//       });

//       if (res.status === 200) {
//         setSuccess(true);
//         setError('');
//       }
//     } catch (err) {
//       if (err.response && err.response.status === 404) {
//         setError('No account found with this email address');
//       } else {
//         setError('Something went wrong. Please try again later.');
//       }
//       console.error('Forgot password error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
//       <div className='flex justify-center gap-x-32'>
//         <img src={coinleyauth} className='w-[750px] h-[650px] object-cover rounded-3xl hidden md:block' alt="Authentication background" />

//         <div>
//           <div className="sm:mx-auto sm:w-full sm:max-w-md w-full">
//             {/* Logo */}
//             <div className="mx-auto flex items-center justify-center">
//               <img src={coinleylogo} className='w-42 object-cover' alt="Coinley logo" />
//             </div>

//             <h2 className={`mt-6 text-center text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//               Forgot Password
//             </h2>
//             <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//               Enter your email and we'll send you a reset link
//             </p>
//           </div>

//           <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-8 px-4 sm:rounded-lg sm:px-10 shadow-xl md:w-[450px]`}>
//               {/* Success Message */}
//               {success ? (
//                 <div className="rounded-md bg-green-50 p-4">
//                   <div className="flex">
//                     <RiCheckboxCircleLine className="h-5 w-5 text-green-400" />
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-green-800">
//                         Password reset link sent!
//                       </h3>
//                       <div className="mt-2 text-sm text-green-700">
//                         <p>
//                           We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
//                         </p>
//                       </div>
//                       <div className="mt-4">
//                         <Link
//                           to="/"
//                           className="font-medium text-blue-600 hover:text-blue-500"
//                         >
//                           Back to login
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <React.Fragment>
//                   {/* Error Message */}
//                   {error && (
//                     <div className="mb-4 rounded-md bg-red-50 p-4">
//                       <div className="flex">
//                         <RiErrorWarningLine className="h-5 w-5 text-red-400" />
//                         <div className="ml-3">
//                           <h3 className="text-sm font-medium text-red-800">
//                             {error}
//                           </h3>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <form className="space-y-6" onSubmit={handleSubmit}>
//                     {/* Email Field */}
//                     <div>
//                       <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
//                         Email address
//                       </label>
//                       <div className="mt-1 relative rounded-md shadow-sm">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <RiMailLine className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
//                         </div>
//                         <input
//                           id="email"
//                           name="email"
//                           type="email"
//                           autoComplete="email"
//                           required
//                           value={email}
//                           onChange={handleChange}
//                           className={`block w-full pl-10 pr-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
//                           placeholder="Enter your email"
//                         />
//                       </div>
//                     </div>

//                     {/* Submit Button */}
//                     <div>
//                       <button
//                         type="submit"
//                         onClick={()=>navigate('/verify-otp')}
//                         disabled={isLoading}
//                         className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7042D2] hover:bg-[#5a35ac] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       >
//                         {isLoading ? 'Sending...' : 'Send Reset Link'}
//                       </button>
//                     </div>

//                     {/* Back to Login */}
//                     <div className="flex items-center justify-center">
//                       <div className="text-sm">
//                         <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
//                           Back to Login
//                         </Link>
//                       </div>
//                     </div>
//                   </form>

//                   {/* Help Section */}
//                   <div className="mt-6">
//                     <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                       Need assistance?{' '}
//                       <Link to="/contact" className="font-medium text-blue-600 hover:text-blue-500">
//                         Contact Support
//                       </Link>
//                     </p>
//                   </div>
//                 </React.Fragment>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;





import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiMailLine,
  RiErrorWarningLine,
  RiCheckboxCircleLine
} from 'react-icons/ri';
import axios from 'axios';
import { URL } from '../url';
import coinleyauth from '../assets/coinley-auth-bg.jpg';
import coinleylogo from '../assets/Logo.png';
import { useDarkMode } from '../context/DarkModeContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Call the forgot-password API
      const res = await axios.post(`${URL}/api/merchants/forgot-password`, { email }, {
        timeout: 50000,
      });

      if (res.status === 200) {
        // Store the reset token if available
        if (res.data.resetToken) {
          localStorage.setItem('resetToken', res.data.resetToken);
        }
        
        // Store email for the next steps
        localStorage.setItem('resetEmail', email);
        
        setSuccess(true);
        
        // Redirect to OTP verification after a short delay
        setTimeout(() => {
          navigate('/verify-otp');
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('No account found with this email address');
      } else {
        setError('Something went wrong. Please try again later.');
      }
      console.error('Forgot password error:', err);
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
              Forgot Password
            </h2>
            <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Enter your email and we'll send you a verification code
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
                        Verification code sent!
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          We've sent a verification code to {email}. Redirecting you to the verification page...
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
                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Email address
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiMailLine className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7042D2] hover:bg-[#5a35ac] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? 'Sending...' : 'Send Verification Code'}
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

export default ForgotPassword;