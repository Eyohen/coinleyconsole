// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
// import { EnvelopeIcon } from '@heroicons/react/24/outline';
// import AuthLayout from '../../components/auth/AuthLayout';
// import AnimatedForm from '../../components/auth/AnimatedForm';
// import Toast from '../../components/common/Toast';
// import axios from 'axios';
// import { URL } from '../../url';

// const VerifyEmail = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
  
//   const email = location.state?.email || '';
//   const fromSignUp = location.state?.fromSignUp || false;
//   const businessType = location.state?.businessType || 'personal';
  
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState('success');
//   const [isResending, setIsResending] = useState(false);
//   const [_isVerifying, setIsVerifying] = useState(false);
//   const [verificationStatus, setVerificationStatus] = useState('pending');
  
//   // Check if there's a token in the URL for verification
//   const token = searchParams.get('token');

//   // Handle automatic verification when token is present in URL
//   useEffect(() => {
//     const verifyEmailWithToken = async () => {
//       if (!token) return;
      
//       setIsVerifying(true);
//       try {
//         // Call the verification endpoint with the token
//         const response = await axios.get(`${URL}/api/merchants/verify-email`, {
//           params: { token }
//         });
        
//         if (response.data.success) {
//           setVerificationStatus('success');
//           setToastMessage('Email verified successfully! You can now log in.');
//           setToastType('success');
//           setShowToast(true);
          
//           // Redirect to login after successful verification
//           setTimeout(() => {
//             navigate('/login');
//           }, 3000);
//         }
//       } catch (error) {
//         setVerificationStatus('error');
//         setToastMessage(error.response?.data?.error || 'Verification failed. Please try again.');
//         setToastType('error');
//         setShowToast(true);
//       } finally {
//         setIsVerifying(false);
//       }
//     };
    
//     verifyEmailWithToken();
//   }, [token, navigate]);

//   const handleResendEmail = async () => {
//     if (!email) {
//       setToastMessage('Email address is missing. Please go back to signup.');
//       setToastType('error');
//       setShowToast(true);
//       return;
//     }
    
//     setIsResending(true);
//     try {
//       // Call the API to resend verification email
//       const response = await axios.post(`${URL}/api/merchants/resend-verification`, {
//         email
//       });
      
//       if (response.data.success) {
//         setToastMessage('Verification email has been resent.');
//         setToastType('success');
//       } else {
//         setToastMessage('Failed to resend verification email.');
//         setToastType('error');
//       }
//     } catch (error) {
//       setToastMessage(error.response?.data?.error || 'Failed to resend verification email.');
//       setToastType('error');
//     } finally {
//       setShowToast(true);
//       setIsResending(false);
//     }
//   };

//   // If token is present but no email in state, show appropriate UI
//   if (token && !email && verificationStatus === 'pending') {
//     return (
//       <AuthLayout
//         title="Verifying your email"
//         subtitle="Please wait while we verify your email address"
//         showProgress={false}
//         currentStep={2}
//         totalSteps={2}
//       >
//         <AnimatedForm>
//           <div className="text-center space-y-6">
//             <div className="flex justify-center">
//               <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
//                 <EnvelopeIcon className="w-8 h-8 text-primary animate-pulse" />
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                 Verifying...
//               </h3>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 We're verifying your email address. This may take a moment.
//               </p>
//             </div>
//           </div>
//         </AnimatedForm>
//       </AuthLayout>
//     );
//   }

//   return (
//     <AuthLayout
//       title="Check your email"
//       subtitle={email ? `We've sent a verification link to ${email}` : "Please check your email"}
//       showProgress={true}
//       currentStep={2}
//       totalSteps={2}
//     >
//       <AnimatedForm>
//         <div className="text-center space-y-6">
//           <div className="flex justify-center">
//             <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
//               <EnvelopeIcon className="w-8 h-8 text-primary" />
//             </div>
//           </div>
          
//           <div className="space-y-2">
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//               Verify your email address
//             </h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Click the link in the email we sent to verify your account and continue with the registration process.
//             </p>
//           </div>
          
//           <div className="space-y-4">
//             {email && (
//               <button
//                 onClick={handleResendEmail}
//                 disabled={isResending}
//                 className="text-sm text-primary hover:text-primary/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isResending ? 'Sending...' : "Didn't receive the email? Click to resend"}
//               </button>
//             )}
            
//             <div className="pt-4">
//               <button
//                 onClick={() => {
//                   if (fromSignUp) {
//                     if (businessType === 'personal') {
//                       navigate('/onboarding/api-integration', { state: { businessType } });
//                     } else {
//                       navigate('/onboarding/business-info', { state: { businessType } });
//                     }
//                   } else {
//                     navigate('/login');
//                   }
//                 }}
//                 className="btn btn-primary w-full"
//               >
//                 {fromSignUp ? 'Continue' : 'Back to Sign in'}
//               </button>
//             </div>
//           </div>
//         </div>
        
//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             <Link to="/login" className="font-medium text-primary hover:text-primary/80">
//               Back to Sign in
//             </Link>
//           </p>
//         </div>
//       </AnimatedForm>
      
//       {showToast && (
//         <Toast
//           message={toastMessage}
//           type={toastType}
//           onClose={() => setShowToast(false)}
//         />
//       )}
//     </AuthLayout>
//   );
// };

// export default VerifyEmail;




import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../url';
import { 
  RiCheckboxCircleFill, 
  RiErrorWarningFill, 
  RiMailLine,
  RiTimeLine,
  RiRefreshLine
} from 'react-icons/ri';
import coinleylogo from '../assets/Logo.png';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  
  // Verify email token on component mount
  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setStatus('error');
      setMessage('Verification token is missing. Please check your email link and try again.');
    }
  }, [token]);
  
  // Verify the token with the server
  const verifyToken = async () => {
    try {
      const response = await axios.get(`${URL}/api/merchants/verify-email`, {
        params: { token }
      });
      
      if (response.data && response.data.success) {
        setStatus('success');
        setMessage(response.data.message || 'Your email has been successfully verified!');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      
      if (error.response && error.response.data) {
        setMessage(error.response.data.error || 'Email verification failed. Please try again.');
      } else {
        setMessage('Network error. Please check your connection and try again.');
      }
    }
  };
  
  // Handle resend verification email
  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }
    
    setIsResending(true);
    
    try {
      const response = await axios.post(`${URL}/api/merchants/resend-verification`, {
        email
      });
      
      if (response.data && response.data.success) {
        setResendSuccess(true);
        setMessage('Verification email has been resent. Please check your inbox.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      
      if (error.response && error.response.data) {
        setMessage(error.response.data.error || 'Failed to resend verification email. Please try again.');
      } else {
        setMessage('Network error. Please check your connection and try again.');
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
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
        
        {/* Status Messages */}
        <div className="mt-4">
          {status === 'verifying' && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7042D2] mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="rounded-md bg-green-50 p-4 text-center">
              <div className="flex justify-center mb-2">
                <RiCheckboxCircleFill className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-green-800 mb-2">Verification Successful!</h3>
              <p className="text-sm text-green-700">{message}</p>
              <p className="text-sm text-green-700 mt-4">Redirecting you to login page...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="rounded-md bg-red-50 p-4 text-center">
              <div className="flex justify-center mb-2">
                <RiErrorWarningFill className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Verification Failed</h3>
              <p className="text-sm text-red-700 mb-4">{message}</p>
              
              {/* Resend verification section */}
              {!resendSuccess && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center justify-center">
                    <RiMailLine className="mr-2" />
                    Resend Verification Email
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter your email address to receive a new verification link:
                  </p>
                  <div className="flex items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#7042D2] focus:border-[#7042D2]"
                      placeholder="Email address"
                    />
                    <button
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="ml-3 px-4 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isResending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          <span>Sending</span>
                        </>
                      ) : (
                        <>
                          <RiRefreshLine className="mr-2" />
                          <span>Resend</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Resend success message */}
              {resendSuccess && (
                <div className="mt-6 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <RiCheckboxCircleFill className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Verification email has been resent. Please check your inbox.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Link to login page */}
              <div className="mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2]"
                >
                  <RiTimeLine className="mr-2" />
                  Return to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;