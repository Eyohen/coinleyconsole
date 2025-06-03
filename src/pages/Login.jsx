// import  { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   RiMailLine,
//   RiLockLine,
//   RiEyeLine,
//   RiEyeOffLine,
//   RiErrorWarningLine
// } from 'react-icons/ri';
// import axios from 'axios';
// import { URL } from '../url';
// import { useAuth } from '../context/AuthContext';

// import coinleylogo from '../assets/Logo.png';



// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//     setError(''); // Clear error when user types
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!formData.email || !formData.password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Add your login API call here
//       const res = await axios.post(`${URL}/api/merchants/login`, formData, {
//         timeout: 50000,
//       });

//       const { token, merchant } = res.data;

//       if (res.status === 200) {
//         localStorage.setItem("access_token", token)
//         login(merchant)
//         setError(false)
//         console.log(res.data)
//         navigate("/dashboard")
//       }

//     } catch (err) {
//       setError('Invalid email or password');
//       console.error('Login error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

//       <div className='flex justify-center gap-x-32'>

//        <div className='w-96'><img src={coinleylogo} className='w-42 object-cover' /></div>


//         <div>
//           <div className="sm:mx-auto sm:w-full sm:max-w-md w-full">
//             {/* Logo placeholder */}
//             {/* <div className="mx-auto flex items-center justify-center">
//               <span className="text-white"><img src={coinleylogo} className='w-42 object-cover' /></span>
//             </div> */}

       
//           </div>

//           <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//             <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10 shadow-xl md:w-[450px]">
//               {/* Error Message */}
//               {error && (
//                 <div className="mb-4 rounded-md bg-red-50 p-4">
//                   <div className="flex">
//                     <RiErrorWarningLine className="h-5 w-5 text-red-400" />
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-red-800">
//                         {error}
//                       </h3>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <form className="space-y-6" onSubmit={handleSubmit}>
                
//                 <p className='font-bold text-2xl'>Login in to admin console</p>

//                 {/* Email Field */}
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                     Email address
//                   </label>
//                   <div className="mt-1 relative rounded-md shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <RiMailLine className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="email"
//                       name="email"
//                       type="email"
//                       autoComplete="email"
//                       required
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter your email"
//                     />
//                   </div>
//                 </div>

//                 {/* Password Field */}
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                     Password
//                   </label>
//                   <div className="mt-1 relative rounded-md shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <RiLockLine className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       autoComplete="current-password"
//                       required
//                       value={formData.password}
//                       onChange={handleChange}
//                       className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter your password"
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <RiEyeOffLine className="h-5 w-5 text-gray-400 hover:text-gray-500" />
//                       ) : (
//                         <RiEyeLine className="h-5 w-5 text-gray-400 hover:text-gray-500" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Remember Me & Forgot Password */}
//                 <div className="flex items-center justify-end">

//                   <div className="text-sm">
//                     <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
//                       Forgot your password?
//                     </Link>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div>
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7042D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
//                       }`}
//                   >
//                     {isLoading ? 'Signing in...' : 'Sign in'}
//                   </button>
//                 </div>



//               </form>



             
//             </div>
//           </div>


//         </div>


//       </div>
//     </div>
//   );
// };

// export default Login;





import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiErrorWarningLine
} from 'react-icons/ri';
import axios from 'axios';
import { URL } from '../url';
import { useAuth } from '../context/AuthContext';

import coinleylogo from '../assets/Logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // Use admin login endpoint
      const res = await axios.post(`${URL}/api/admin/login`, {
        email: formData.email,
        password: formData.password
      }, {
        timeout: 50000,
      });

      const { token, admin } = res.data;

      if (res.status === 200) {
        localStorage.setItem("access_token", token)
        login(admin) // Login with admin data
        setError('')
        console.log('Admin login successful:', res.data)
        navigate("/dashboard")
      }

    } catch (err) {
      console.error('Admin login error:', err);
      
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className='flex justify-center gap-x-32'>
        <div className='w-96'>
          <img src={coinleylogo} className='w-42 object-cover' alt="Coinley Logo" />
        </div>

        <div>
          <div className="sm:mx-auto sm:w-full sm:max-w-md w-full">
            {/* Logo placeholder */}
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10 shadow-xl md:w-[450px]">
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
                <p className='font-bold text-2xl'>Login to admin console</p>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RiMailLine className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RiLockLine className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <RiEyeOffLine className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <RiEyeLine className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-end">
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7042D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
                    }`}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;