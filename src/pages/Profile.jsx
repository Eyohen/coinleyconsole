import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../url';
import { 
  RiUserLine, 
  RiMailLine, 
  RiPhoneLine, 
  RiBriefcaseLine, 
  RiEdit2Line,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiLockLine,
  RiSaveLine,
  RiRefreshLine,
  RiBuilding4Line,
  RiGlobalLine
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    position: '',
    businessName: '',
    businessType: '',
    industry: '',
    website: '',
    country: '',
    state: '',
    city: '',
    address: '',
    postal: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Get merchant data from the dashboard endpoint which provides full profile details
      const response = await axios.get(`${URL}/api/merchants/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'x-api-key': user?.apiKey || '',
          'x-api-secret': user?.apiSecret || ''
        }
      });
      
      if (response.data && response.data.merchant) {
        const merchantData = response.data.merchant;
        
        // Update state with fetched profile data
        setProfileData({
          firstName: merchantData.firstName || '',
          lastName: merchantData.lastName || '',
          email: merchantData.email || '',
          phoneNumber: merchantData.phone || '',
          position: merchantData.position || '',
          businessName: merchantData.businessName || '',
          businessType: merchantData.businessType || '',
          industry: merchantData.industry || '',
          website: merchantData.website || '',
          country: merchantData.country || '',
          state: merchantData.state || '',
          city: merchantData.city || '',
          address: merchantData.address || '',
          postal: merchantData.postal || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage('Unable to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is loaded with API credentials
    if (user && user.apiKey && user.apiSecret) {
      fetchProfile();
    } else if (user) {
      // If user exists but missing API credentials, show partial data
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phone || '',
        position: user.position || '',
        businessName: user.businessName || '',
        // Other fields will remain empty
      });
      setLoading(false);
      setErrorMessage('Some profile data may be unavailable. Please check your API credentials.');
    } else {
      // No user data available
      setLoading(false);
      setErrorMessage('Unable to load user data. Please try logging in again.');
    }
  }, [user]);

  // Handle form input changes for profile data
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any previous messages
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Handle form input changes for password data
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any previous messages
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Handle profile update submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    // Prepare data for API - match the expected backend field names
    const updateData = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      businessName: profileData.businessName,
      businessType: profileData.businessType,
      phone: profileData.phoneNumber, // Note: API expects 'phone' not 'phoneNumber'
      industry: profileData.industry,
      position: profileData.position,
      state: profileData.state,
      country: profileData.country,
      postal: profileData.postal,
      city: profileData.city,
      website: profileData.website,
      address: profileData.address
    };
    
    try {
      const response = await axios.put(`${URL}/api/merchants/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'x-api-key': user?.apiKey || '',
          'x-api-secret': user?.apiSecret || ''
        }
      });
      
      if (response.data && response.data.success) {
        // Update the user in context
        login({
          ...user,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          businessName: profileData.businessName,
          // Other fields that should be in the user object
        });
        
        setSuccessMessage('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Handle password change submission
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validate password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      setUpdating(false);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      setUpdating(false);
      return;
    }
    
    try {
      await axios.put(`${URL}/api/merchants/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'x-api-key': user?.apiKey || '',
          'x-api-secret': user?.apiSecret || ''
        }
      });
      
      setSuccessMessage('Password updated successfully!');
      
      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Close password change section
      setChangePassword(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to change password. Please check your current password.');
    } finally {
      setUpdating(false);
    }
  };

  // Refresh profile data
  const handleRefreshProfile = () => {
    fetchProfile();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
        <button 
          onClick={handleRefreshProfile}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <RiRefreshLine className="text-gray-600" />
          <span>Refresh</span>
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Profile Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#7042D2] bg-opacity-10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[#7042D2]">
                  {profileData.firstName && profileData.lastName 
                    ? `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`
                    : 'ME'}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {`${profileData.firstName} ${profileData.lastName}`}
              </h2>
              <p className="text-gray-600 mt-1">{profileData.position}</p>
              <p className="text-gray-600 mt-1">{profileData.email}</p>
              
              {/* Company Info */}
              {profileData.businessName && (
                <div className="mt-4 pt-4 border-t border-gray-200 w-full">
                  <h3 className="font-medium text-gray-700 mb-2">Company</h3>
                  <p className="text-gray-800 font-medium">{profileData.businessName}</p>
                  {profileData.businessType && (
                    <p className="text-gray-600 text-sm">{profileData.businessType}</p>
                  )}
                </div>
              )}
              
              {/* API Credentials Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200 w-full">
                <h3 className="font-medium text-gray-700 mb-2">API Credentials</h3>
                <div className="bg-gray-50 rounded p-2 text-left">
                  <p className="text-xs text-gray-500">API Key:</p>
                  <p className="text-sm font-mono truncate">{user?.apiKey ? `${user.apiKey.substring(0, 8)}...` : 'Not available'}</p>
                </div>
              </div>
              
              {/* Password change toggle button */}
              <button
                onClick={() => setChangePassword(!changePassword)}
                className="mt-6 flex items-center gap-2 text-[#7042D2] font-medium"
              >
                <RiLockLine />
                Change Password
              </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="md:col-span-2">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-md flex items-center">
                <RiCheckboxCircleFill className="text-green-500 mr-2 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
            
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md flex items-center">
                <RiErrorWarningLine className="text-red-500 mr-2 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            
            {changePassword ? (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <RiLockLine className="mr-2" />
                  Change Password
                </h2>
                
                <form onSubmit={handleUpdatePassword}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setChangePassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <RiSaveLine />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <RiUserLine className="mr-2" />
                    Personal Information
                  </h2>
                  
                  <form onSubmit={handleUpdateProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiUserLine className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileChange}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiUserLine className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileChange}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiMailLine className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] bg-gray-50"
                            disabled
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Email address cannot be changed
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiPhoneLine className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={profileData.phoneNumber}
                            onChange={handleProfileChange}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Position
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiBriefcaseLine className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="position"
                            value={profileData.position}
                            onChange={handleProfileChange}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                            placeholder="e.g., CEO, Finance Manager, etc."
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Business Information */}
                    <h3 className="text-lg font-medium text-gray-800 mt-8 mb-4 pt-4 border-t border-gray-200">
                      Business Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Business Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiBuilding4Line className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="businessName"
                            value={profileData.businessName}
                            onChange={handleProfileChange}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Business Type
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiBuilding4Line className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="businessType"
                            value={profileData.businessType}
                            onChange={handleProfileChange}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                            placeholder="e.g., LLC, Corporation, Sole Proprietorship"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Industry
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiBriefcaseLine className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="industry"
                            value={profileData.industry}
                            onChange={handleProfileChange}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                            placeholder="e.g., Retail, Technology, Finance"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Website
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiGlobalLine className="text-gray-400" />
                          </div>
                          <input
                            type="url"
                            name="website"
                            value={profileData.website}
                            onChange={handleProfileChange}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                      
                      {/* Location Information */}
                      <h3 className="text-lg font-medium text-gray-800 md:col-span-2 mb-2">
                        Location
                      </h3>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={profileData.country}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={profileData.state}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Postal/ZIP Code
                        </label>
                        <input
                          type="text"
                          name="postal"
                          value={profileData.postal}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                          placeholder="Street address, Suite/Unit, etc."
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button
                        type="submit"
                        disabled={updating}
                        className="px-6 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {updating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <RiEdit2Line />
                            <span>Update Profile</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;