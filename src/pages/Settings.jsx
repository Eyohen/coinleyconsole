import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../url';
import { useAuth } from '../context/AuthContext';
import { 
  RiStoreLine, 
  RiPhoneLine, 
  RiGlobalLine, 
  RiMapPinLine,
  RiBuilding4Line,
  RiUserSettingsLine,
  RiFlagLine,
  RiMailLine,
  RiLockLine,
  RiKeyLine,
  RiShieldLine,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiRefreshLine,
  RiFileTextLine,
  RiFileCopyLine,
  RiInformationLine,
  RiDownload2Line,
  RiToggleLine,
  RiToggleFill,
  RiEyeLine
} from 'react-icons/ri';

const industryOptions = [
  "E-commerce", "SaaS", "Finance", "Healthcare", "Education", "Gaming", 
  "Entertainment", "Travel", "Food & Beverage", "Real Estate", "Other"
];

const countryOptions = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Japan", "China", "India", "Brazil", "Nigeria", "South Africa", "Other"
];

const Settings = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [merchantData, setMerchantData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState({ key: '', secret: '' });
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Business information form state
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    businessType: '',
    phone: '',
    industry: '',
    position: '',
    state: '',
    country: '',
    postal: '',
    city: '',
    website: '',
    address: ''
  });
  
  // API settings form state
  const [apiForm, setApiForm] = useState({
    testMode: false
  });

  // Initialize admin data from auth context
  useEffect(() => {
    if (user) {
      setLoading(false);
      setMerchantData(user);

      // Initialize business form with admin data from auth context
      setBusinessForm({
        businessName: user.name || '',
        businessType: user.businessType || '',
        phone: user.phone || '',
        industry: user.industry || '',
        position: user.position || '',
        state: user.state || '',
        country: user.country || '',
        postal: user.postal || '',
        city: user.city || '',
        website: user.website || '',
        address: user.address || ''
      });

      // Initialize API form
      setApiForm({
        testMode: user.status === 'test' || false
      });
    } else {
      setLoading(false);
      setErrorMessage('User not authenticated. Please login again.');
    }
  }, [user]);

  // Handle business form input changes
  const handleBusinessFormChange = (e) => {
    const { name, value } = e.target;
    setBusinessForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages
    setSuccessMessage('');
    setErrorMessage('');
  };
  
  // Handle API form changes
  const handleApiFormChange = (e) => {
    const { name, checked, type, value } = e.target;
    
    setApiForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear messages
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Handle business form submission
  const handleBusinessFormSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Admin profile update functionality coming soon
    setErrorMessage('Admin profile updates are not available yet. Please contact support to update your profile.');
    setUpdating(false);

    // TODO: Implement admin profile update endpoint in backend
    /*
    try {
      const response = await axios.put(`${URL}/api/admin/profile`, businessForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.data && response.data.success) {
        setMerchantData(prev => ({
          ...prev,
          ...businessForm
        }));

        if (login && typeof login === 'function') {
          login({
            ...user,
            ...businessForm
          });
        }

        setSuccessMessage('Business information updated successfully!');

        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating business information:', error);
      setErrorMessage('Failed to update business information. Please try again.');
    } finally {
      setUpdating(false);
    }
    */
  };

  // Handle API form submission (test mode toggle)
  const handleApiFormSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Admin API settings update functionality coming soon
    setErrorMessage('Admin API settings updates are not available yet. Please contact support to update your settings.');
    setUpdating(false);

    // TODO: Implement admin API settings update endpoint in backend
    /*
    try {
      const response = await axios.put(`${URL}/api/admin/settings`, {
        status: apiForm.testMode ? 'test' : 'active'
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.data && response.data.success) {
        setMerchantData(prev => ({
          ...prev,
          status: apiForm.testMode ? 'test' : 'active'
        }));

        setSuccessMessage('API settings updated successfully!');

        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating API settings:', error);
      setErrorMessage('Failed to update API settings. Please try again.');
    } finally {
      setUpdating(false);
    }
    */
  };

  // Reset API keys (simulated for now)
  const handleResetApiKeys = async () => {
    if (!window.confirm('Are you sure you want to reset your API keys? This will invalidate your existing keys and you will need to update all integrations.')) {
      return;
    }
    
    setUpdating(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Simulate API call - you'll need to implement this on your server
      setTimeout(() => {
        const newApiKey = `pk_${Math.random().toString(36).substring(2, 15)}`;
        const newApiSecret = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        
        // Update local merchant data with new keys
        setMerchantData(prev => ({
          ...prev,
          apiKey: newApiKey,
          apiSecret: newApiSecret
        }));
        
        // Update auth context
        if (login && typeof login === 'function') {
          login({
            ...user,
            apiKey: newApiKey,
            apiSecret: newApiSecret
          });
        }
        
        setSuccessMessage('API keys reset successfully! Please update your integrations.');
        setUpdating(false);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }, 1500);
    } catch (error) {
      console.error('Error resetting API keys:', error);
      setErrorMessage('Failed to reset API keys. Please try again.');
      setUpdating(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess({ ...copySuccess, [type]: 'Copied!' });
        setTimeout(() => {
          setCopySuccess({ ...copySuccess, [type]: '' });
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Download API documentation
  const downloadApiDocumentation = () => {
    // Create dummy content for the API documentation
    const documentContent = `
# Coinley API Documentation

## Introduction
Coinley provides a simple, secure API for integrating cryptocurrency payments into your application.

## Authentication
All API requests must include your API key and secret for authentication.

\`\`\`
x-api-key: ${merchantData?.apiKey || 'your_api_key'}
x-api-secret: ${merchantData?.apiSecret || 'your_api_secret'}
\`\`\`

## Endpoints

### Create Payment
POST /api/payments/create

Request Body:
\`\`\`json
{
  "amount": 100.00,
  "currency": "USDT",
  "customerEmail": "customer@example.com",
  "callbackUrl": "https://your-website.com/payment-callback"
}
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "payment": {
    "id": "payment_id",
    "amount": 100.00,
    "currency": "USDT",
    "status": "pending"
  },
  "paymentUrl": "https://coinley.app/pay/payment_id"
}
\`\`\`

### Get Payment
GET /api/payments/:id

Response:
\`\`\`json
{
  "payment": {
    "id": "payment_id",
    "amount": 100.00,
    "currency": "USDT",
    "status": "completed",
    "createdAt": "2023-01-01T12:00:00Z"
  }
}
\`\`\`

## Webhooks
Coinley can send webhooks to your system when payment status changes.

### Webhook Format
\`\`\`json
{
  "event": "payment.completed",
  "payment": {
    "id": "payment_id",
    "status": "completed",
    "amount": 100.00,
    "currency": "USDT",
    "transactionHash": "0x..."
  }
}
\`\`\`
`;

    // Create a blob from the content
    const blob = new Blob([documentContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'coinley-api-documentation.md';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      {/* Global messages */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg flex items-center">
          <RiErrorWarningLine className="text-red-500 mr-2 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg flex items-center">
          <RiCheckboxCircleFill className="text-green-500 mr-2 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7042D2]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="space-y-1">
                <button 
                  onClick={() => setActiveTab('business')}
                  className={`w-full px-4 py-3 text-left rounded-lg flex items-center ${
                    activeTab === 'business' 
                      ? 'bg-[#7042D2] text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <RiStoreLine className="mr-3 text-lg" />
                  <span>Business Information</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('api')}
                  className={`w-full px-4 py-3 text-left rounded-lg flex items-center ${
                    activeTab === 'api' 
                      ? 'bg-[#7042D2] text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <RiKeyLine className="mr-3 text-lg" />
                  <span>API & Integration</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Business Information */}
            {activeTab === 'business' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <RiStoreLine className="mr-2 text-[#7042D2]" />
                  Business Information
                </h2>
                
                <form onSubmit={handleBusinessFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Name */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiStoreLine className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="businessName"
                          value={businessForm.businessName}
                          onChange={handleBusinessFormChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Business Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiBuilding4Line className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="businessType"
                          value={businessForm.businessType}
                          onChange={handleBusinessFormChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                          placeholder="e.g., Corporation, LLC, Sole Proprietorship"
                        />
                      </div>
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiPhoneLine className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={businessForm.phone}
                          onChange={handleBusinessFormChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                          placeholder="+1 (123) 456-7890"
                        />
                      </div>
                    </div>
                    
                    {/* Industry */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiBuilding4Line className="text-gray-400" />
                        </div>
                        <select
                          name="industry"
                          value={businessForm.industry}
                          onChange={handleBusinessFormChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] appearance-none bg-none"
                        >
                          <option value="">Select Industry</option>
                          {industryOptions.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Position */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Position
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiUserSettingsLine className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="position"
                          value={businessForm.position}
                          onChange={handleBusinessFormChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                          placeholder="e.g., CEO, CFO, Manager"
                        />
                      </div>
                    </div>
                    
                    {/* Website */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiGlobalLine className="text-gray-400" />
                        </div>
                        <input
                          type="url"
                          name="website"
                          value={businessForm.website}
                          onChange={handleBusinessFormChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                    
                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiFlagLine className="text-gray-400" />
                        </div>
                        <select
                          name="country"
                          value={businessForm.country}
                          onChange={handleBusinessFormChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] appearance-none bg-none"
                        >
                          <option value="">Select Country</option>
                          {countryOptions.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* State/Province */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiMapPinLine className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="state"
                          value={businessForm.state}
                          onChange={handleBusinessFormChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                          placeholder="e.g., California, Ontario"
                        />
                      </div>
                    </div>
                    
                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiMapPinLine className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="city"
                          value={businessForm.city}
                          onChange={handleBusinessFormChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                        />
                      </div>
                    </div>
                    
                    {/* Postal/ZIP Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal/ZIP Code
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiMapPinLine className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="postal"
                          value={businessForm.postal}
                          onChange={handleBusinessFormChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                        />
                      </div>
                    </div>
                    
                    {/* Address */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <RiMapPinLine className="text-gray-400" />
                        </div>
                        <textarea
                          name="address"
                          value={businessForm.address}
                          onChange={handleBusinessFormChange}
                          rows="3"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                          placeholder="Street address, Suite/Apt #, etc."
                        ></textarea>
                      </div>
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
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* API & Integration */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                {/* API Keys Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <RiKeyLine className="mr-2 text-[#7042D2]" />
                    API Keys
                  </h2>
                  
                  <div className="bg-gray-50 p-4 mb-6 rounded-lg text-sm text-gray-600 flex items-start">
                    <RiInformationLine className="text-[#7042D2] mt-1 mr-2 flex-shrink-0" />
                    <p>
                      Your API keys grant access to your account. Never share these keys publicly or with unauthorized individuals.
                      If you believe your keys have been compromised, reset them immediately.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* API Key */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <div className="flex items-center">
                        <div className="relative flex-grow">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiKeyLine className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={merchantData?.apiKey || ''}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                            readOnly
                          />
                        </div>
                        <button 
                          onClick={() => copyToClipboard(merchantData?.apiKey || '', 'key')}
                          className="ml-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
                        >
                          <div className="flex items-center">
                            <RiFileCopyLine className="mr-1" />
                            <span>{copySuccess.key || 'Copy'}</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    
                    {/* API Secret */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Secret
                      </label>
                      <div className="flex items-center">
                        <div className="relative flex-grow">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiLockLine className="text-gray-400" />
                          </div>
                          <input
                            type={showSecretKey ? "text" : "password"}
                            value={merchantData?.apiSecret || ''}
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                            readOnly
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowSecretKey(!showSecretKey)}
                          >
                            {showSecretKey ? (
                              <RiEyeOffLine className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                            ) : (
                              <RiEyeLine className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                            )}
                          </button>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(merchantData?.apiSecret || '', 'secret')}
                          className="ml-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
                        >
                          <div className="flex items-center">
                            <RiFileCopyLine className="mr-1" />
                            <span>{copySuccess.secret || 'Copy'}</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    
                    {/* Reset API Keys Button */}
                    <div className="mt-6">
                      <button
                        onClick={handleResetApiKeys}
                        disabled={updating}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 focus:outline-none flex items-center"
                      >
                        {updating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                            <span>Resetting...</span>
                          </>
                        ) : (
                          <>
                            <RiRefreshLine className="mr-2" />
                            <span>Reset API Keys</span>
                          </>
                        )}
                      </button>
                      <p className="mt-2 text-xs text-gray-500">
                        Warning: Resetting your API keys will invalidate all existing keys. You will need to update all your integrations.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Mode Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <RiToggleLine className="mr-2 text-[#7042D2]" />
                    API Mode
                  </h2>
                  
                  <form onSubmit={handleApiFormSubmit}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-800">Test Mode</h3>
                          <p className="text-sm text-gray-500">
                            Use test mode to simulate transactions without processing real payments.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="testMode"
                            checked={apiForm.testMode} 
                            onChange={handleApiFormChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7042D2]"></div>
                        </label>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm flex items-start">
                        <RiInformationLine className="text-yellow-600 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Current mode: {apiForm.testMode ? 'Test' : 'Live'}</p>
                          <p className="mt-1">
                            {apiForm.testMode 
                              ? 'You are in test mode. No real transactions will be processed.' 
                              : 'You are in live mode. All transactions will be processed with real funds.'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
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
                            <span>Save Mode</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                
                {/* Documentation */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <RiFileTextLine className="mr-2 text-[#7042D2]" />
                    API Documentation
                  </h2>
                  
                  <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">Integration Guide</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Detailed documentation for integrating Coinley payment gateway with your application.
                        </p>
                      </div>
                      <button
                        onClick={downloadApiDocumentation}
                        className="px-4 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90 flex items-center"
                      >
                        <RiDownload2Line className="mr-2" />
                        <span>Download</span>
                      </button>
                    </div>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Quick Start Guide</h4>
                      <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                        <li>Use your API key and secret for authentication</li>
                        <li>Create a payment with the <code className="bg-gray-200 px-1 py-0.5 rounded">/api/payments/create</code> endpoint</li>
                        <li>Redirect your customer to the payment URL</li>
                        <li>Configure your webhook to receive payment updates</li>
                      </ol>
                      
                      <div className="mt-4 p-3 bg-gray-100 rounded-md">
                        <p className="text-xs text-gray-500 mb-1">Example API Request:</p>
                        <pre className="text-xs overflow-x-auto p-2 bg-gray-800 text-green-400 rounded">
{`POST ${URL}/api/payments/create
x-api-key: ${merchantData?.apiKey || 'your_api_key'}
x-api-secret: ${merchantData?.apiSecret || 'your_api_secret'}

{
  "amount": 100,
  "currency": "USDT",
  "customerEmail": "customer@example.com"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Webhooks (placeholder for future implementation) */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold flex items-center">
                      <RiShieldLine className="mr-2 text-[#7042D2]" />
                      Webhooks
                    </h2>
                    
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  
                  <p className="text-gray-500 mb-6">
                    Webhooks allow your application to receive real-time updates about payment status changes.
                    This feature will be available soon.
                  </p>
                  
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
                    <p className="text-gray-400">Webhook configuration will be available in a future update</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;