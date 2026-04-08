import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../url';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
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
  RiEyeLine,
  RiEyeOffLine,
  RiSettings4Line,
  RiWalletLine,
  RiPercentLine,
  RiSave3Line
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
  const { darkMode } = useDarkMode();
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

  // Platform Settings state
  const [platformSettings, setPlatformSettings] = useState(null);
  const [platformLoading, setPlatformLoading] = useState(false);
  const [platformSaving, setPlatformSaving] = useState(false);
  const [defaultFeePercentage, setDefaultFeePercentage] = useState('1');
  const [feeWallets, setFeeWallets] = useState({
    defaultFeeWallet: '',
    ethereum: '',
    bsc: '',
    polygon: '',
    arbitrum: '',
    optimism: '',
    avalanche: '',
    base: '',
    celo: '',
    tron: '',
    solana: '',
    algorand: ''
  });

  const networkInfo = {
    ethereum: { name: 'Ethereum', format: '0x... (42 chars)' },
    bsc: { name: 'Binance Smart Chain', format: '0x... (42 chars)' },
    polygon: { name: 'Polygon', format: '0x... (42 chars)' },
    arbitrum: { name: 'Arbitrum', format: '0x... (42 chars)' },
    optimism: { name: 'Optimism', format: '0x... (42 chars)' },
    avalanche: { name: 'Avalanche', format: '0x... (42 chars)' },
    base: { name: 'Base', format: '0x... (42 chars)' },
    celo: { name: 'Celo', format: '0x... (42 chars)' },
    tron: { name: 'TRON', format: 'T... (34 chars)' },
    solana: { name: 'Solana', format: 'Base58 (32-44 chars)' },
    algorand: { name: 'Algorand', format: 'Base32 (58 chars)' }
  };

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
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
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
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
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

  // Fetch platform settings
  const fetchPlatformSettings = async () => {
    setPlatformLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.get(`${URL}/api/admin/settings/platform`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
        }
      });

      if (response.data.success) {
        const { settings } = response.data;
        setPlatformSettings(settings);

        // Populate default fee percentage (convert decimal to percentage for display)
        const feeAsPercent = settings.defaultFeePercentage
          ? (parseFloat(settings.defaultFeePercentage) * 100).toString()
          : '1';
        setDefaultFeePercentage(feeAsPercent);

        // Populate fee wallets
        setFeeWallets({
          defaultFeeWallet: settings.defaultFeeWallet || '',
          ethereum: settings.feeWalletAddresses?.ethereum || '',
          bsc: settings.feeWalletAddresses?.bsc || '',
          polygon: settings.feeWalletAddresses?.polygon || '',
          arbitrum: settings.feeWalletAddresses?.arbitrum || '',
          optimism: settings.feeWalletAddresses?.optimism || '',
          avalanche: settings.feeWalletAddresses?.avalanche || '',
          base: settings.feeWalletAddresses?.base || '',
          celo: settings.feeWalletAddresses?.celo || '',
          tron: settings.feeWalletAddresses?.tron || '',
          solana: settings.feeWalletAddresses?.solana || '',
          algorand: settings.feeWalletAddresses?.algorand || ''
        });
      }
    } catch (error) {
      console.error('Error fetching platform settings:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to load platform settings');
    } finally {
      setPlatformLoading(false);
    }
  };

  // Save platform settings
  const handleSavePlatformSettings = async () => {
    setPlatformSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { defaultFeeWallet, ...networkWallets } = feeWallets;

      // Convert percentage to decimal for storage (e.g., 1% -> 0.01)
      const feeAsDecimal = parseFloat(defaultFeePercentage) / 100;

      // Validate fee percentage
      if (isNaN(feeAsDecimal) || feeAsDecimal < 0.001 || feeAsDecimal > 0.10) {
        setErrorMessage('Fee percentage must be between 0.1% and 10%');
        setPlatformSaving(false);
        return;
      }

      const updates = {
        defaultFeeWallet,
        feeWalletAddresses: networkWallets,
        defaultFeePercentage: feeAsDecimal
      };

      const response = await axios.put(
        `${URL}/api/admin/settings/platform`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccessMessage('Platform settings updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        await fetchPlatformSettings(); // Refresh settings
      }
    } catch (error) {
      console.error('Error saving platform settings:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to save platform settings');
    } finally {
      setPlatformSaving(false);
    }
  };

  // Handle fee wallet input change
  const handleFeeWalletChange = (field, value) => {
    setFeeWallets(prev => ({
      ...prev,
      [field]: value
    }));
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
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h1>
      </div>

      {/* Global messages */}
      {errorMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${darkMode ? 'bg-red-900/30 border border-red-700 text-red-400' : 'bg-red-50 text-red-800'}`}>
          <RiErrorWarningLine className="text-red-500 mr-2 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${darkMode ? 'bg-green-900/30 border border-green-700 text-green-400' : 'bg-green-50 text-green-800'}`}>
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
            <div className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('business')}
                  className={`w-full px-4 py-3 text-left rounded-lg flex items-center ${
                    activeTab === 'business'
                      ? 'bg-[#7042D2] text-white'
                      : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
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
                      : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <RiKeyLine className="mr-3 text-lg" />
                  <span>API & Integration</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('platform');
                    if (!platformSettings) {
                      fetchPlatformSettings();
                    }
                  }}
                  className={`w-full px-4 py-3 text-left rounded-lg flex items-center ${
                    activeTab === 'platform'
                      ? 'bg-[#7042D2] text-white'
                      : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <RiSettings4Line className="mr-3 text-lg" />
                  <span>Platform Settings</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Business Information */}
            {activeTab === 'business' && (
              <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-semibold mb-6 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <RiStoreLine className="mr-2 text-[#7042D2]" />
                  Business Information
                </h2>

                <form onSubmit={handleBusinessFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Name */}
                    <div className="col-span-2">
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                          required
                        />
                      </div>
                    </div>

                    {/* Business Type */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900'}`}
                          placeholder="e.g., Corporation, LLC, Sole Proprietorship"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900'}`}
                          placeholder="+1 (123) 456-7890"
                        />
                      </div>
                    </div>

                    {/* Industry */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] appearance-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
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
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900'}`}
                          placeholder="e.g., CEO, CFO, Manager"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900'}`}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] appearance-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
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
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900'}`}
                          placeholder="e.g., California, Ontario"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                        />
                      </div>
                    </div>

                    {/* Postal/ZIP Code */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="col-span-2">
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'border-gray-300 text-gray-900'}`}
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
                <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h2 className={`text-xl font-semibold mb-6 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <RiKeyLine className="mr-2 text-[#7042D2]" />
                    API Keys
                  </h2>

                  <div className={`p-4 mb-6 rounded-lg text-sm flex items-start ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                    <RiInformationLine className="text-[#7042D2] mt-1 mr-2 flex-shrink-0" />
                    <p>
                      Your API keys grant access to your account. Never share these keys publicly or with unauthorized individuals.
                      If you believe your keys have been compromised, reset them immediately.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* API Key */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                            className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                            readOnly
                          />
                        </div>
                        <button
                          onClick={() => copyToClipboard(merchantData?.apiKey || '', 'key')}
                          className={`ml-2 px-3 py-2 rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                            className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
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
                          className={`ml-2 px-3 py-2 rounded-md focus:outline-none ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
                        className={`px-4 py-2 border border-red-500 text-red-500 rounded-md focus:outline-none flex items-center ${darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'}`}
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
                      <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Warning: Resetting your API keys will invalidate all existing keys. You will need to update all your integrations.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Mode Settings */}
                <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h2 className={`text-xl font-semibold mb-6 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <RiToggleLine className="mr-2 text-[#7042D2]" />
                    API Mode
                  </h2>

                  <form onSubmit={handleApiFormSubmit}>
                    <div className="space-y-4">
                      <div className={`flex items-center justify-between p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div>
                          <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Test Mode</h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                          <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7042D2] ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                        </label>
                      </div>

                      <div className={`p-4 rounded-lg text-sm flex items-start ${darkMode ? 'bg-yellow-900/30 border border-yellow-700 text-yellow-400' : 'bg-yellow-50 text-yellow-800'}`}>
                        <RiInformationLine className={`mt-1 mr-2 flex-shrink-0 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
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
                <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h2 className={`text-xl font-semibold mb-6 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <RiFileTextLine className="mr-2 text-[#7042D2]" />
                    API Documentation
                  </h2>

                  <div className={`p-6 border rounded-lg ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Integration Guide</h3>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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

                    <div className={`mt-6 border-t pt-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quick Start Guide</h4>
                      <ol className={`list-decimal list-inside text-sm space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <li>Use your API key and secret for authentication</li>
                        <li>Create a payment with the <code className={`px-1 py-0.5 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>/api/payments/create</code> endpoint</li>
                        <li>Redirect your customer to the payment URL</li>
                        <li>Configure your webhook to receive payment updates</li>
                      </ol>

                      <div className={`mt-4 p-3 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Example API Request:</p>
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
                <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <RiShieldLine className="mr-2 text-[#7042D2]" />
                      Webhooks
                    </h2>

                    <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                      Coming Soon
                    </span>
                  </div>

                  <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Webhooks allow your application to receive real-time updates about payment status changes.
                    This feature will be available soon.
                  </p>

                  <div className={`p-4 border border-dashed rounded-lg text-center ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                    <p className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Webhook configuration will be available in a future update</p>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Settings */}
            {activeTab === 'platform' && (
              <div className="space-y-6">
                {/* Header with Refresh */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className={`text-xl font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <RiSettings4Line className="mr-2 text-[#7042D2]" />
                      Platform Settings
                    </h2>
                    <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Configure fee wallet addresses and transaction fees across blockchain networks
                    </p>
                  </div>
                  <button
                    onClick={fetchPlatformSettings}
                    disabled={platformLoading}
                    className={`flex items-center gap-2 px-3 py-2 text-[#7042D2] border border-[#7042D2] rounded-lg transition-colors ${darkMode ? 'hover:bg-purple-900/30' : 'hover:bg-purple-50'}`}
                  >
                    <RiRefreshLine className={platformLoading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>

                {platformLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7042D2]"></div>
                  </div>
                ) : (
                  <>
                    {/* Info Card */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                      <div className="flex items-start">
                        <RiInformationLine className="text-blue-500 mr-3 mt-1 flex-shrink-0 text-xl" />
                        <div>
                          <h3 className={`font-medium mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>Important Information</h3>
                          <ul className={`text-sm space-y-1 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                            <li>• Fee wallet addresses receive transaction fees from customer payments</li>
                            <li>• Each network can have a different wallet address</li>
                            <li>• If a network-specific wallet is not set, the default wallet will be used</li>
                            <li>• Ensure wallet addresses are correct - sending to wrong addresses cannot be reversed</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Default Transaction Fee */}
                    <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        <RiPercentLine className="text-[#7042D2]" />
                        Default Transaction Fee
                      </h3>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Platform-wide default transaction fee applied to all merchants without a custom fee.
                      </p>

                      <div className="max-w-xs">
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Fee Percentage
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="10"
                            value={defaultFeePercentage}
                            onChange={(e) => setDefaultFeePercentage(e.target.value)}
                            className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-[#7042D2] focus:border-transparent text-lg font-semibold ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          />
                          <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>%</span>
                        </div>
                        <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Enter a value between 0.1% and 10%. Merchants receive {(100 - parseFloat(defaultFeePercentage || 0)).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Default Fee Wallet */}
                    <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        <RiWalletLine className="text-[#7042D2]" />
                        Default Fee Wallet
                      </h3>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        This address will be used for all networks that don't have a specific wallet configured.
                      </p>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Default Wallet Address
                        </label>
                        <input
                          type="text"
                          value={feeWallets.defaultFeeWallet}
                          onChange={(e) => handleFeeWalletChange('defaultFeeWallet', e.target.value)}
                          placeholder="0x..."
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7042D2] focus:border-transparent font-mono text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                    </div>

                    {/* Network-Specific Fee Wallets */}
                    <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        <RiWalletLine className="text-[#7042D2]" />
                        Network-Specific Fee Wallets
                      </h3>
                      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Configure specific wallet addresses for each blockchain network.
                      </p>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {Object.entries(networkInfo).map(([network, info]) => (
                          <div key={network} className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {info.name}
                              <span className={`text-xs ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>({info.format})</span>
                            </label>
                            <input
                              type="text"
                              value={feeWallets[network]}
                              onChange={(e) => handleFeeWalletChange(network, e.target.value)}
                              placeholder={`Enter ${info.name} wallet address`}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#7042D2] focus:border-transparent font-mono text-xs ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSavePlatformSettings}
                        disabled={platformSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-[#7042D2] text-white rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <RiSave3Line className="text-xl" />
                        {platformSaving ? 'Saving...' : 'Save Platform Settings'}
                      </button>
                    </div>

                    {/* Last Updated Info */}
                    {platformSettings && platformSettings.updatedAt && (
                      <div className={`text-sm text-right ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Last updated: {new Date(platformSettings.updatedAt).toLocaleString()}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;