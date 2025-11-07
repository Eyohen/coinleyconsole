import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../url';
import { useAuth } from '../context/AuthContext';
import {
  RiWalletLine,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiInformationLine,
  RiSave3Line,
  RiRefreshLine,
  RiSettings4Line
} from 'react-icons/ri';

const PlatformSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  // Fetch platform settings
  const fetchPlatformSettings = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.get(`${URL}/api/admin/settings/platform`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.data.success) {
        const { settings } = response.data;
        setSettings(settings);

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
      setLoading(false);
    }
  };

  // Save platform settings
  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { defaultFeeWallet, ...networkWallets } = feeWallets;

      const updates = {
        defaultFeeWallet,
        feeWalletAddresses: networkWallets
      };

      const response = await axios.put(
        `${URL}/api/admin/settings/platform`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
      setSaving(false);
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFeeWallets(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchPlatformSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading platform settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <RiSettings4Line className="text-purple-600" />
              Platform Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Configure fee wallet addresses for receiving transaction fees across different blockchain networks
            </p>
          </div>
          <button
            onClick={fetchPlatformSettings}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <RiRefreshLine className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800">
          <RiCheckboxCircleFill className="text-green-500 mr-3 text-xl flex-shrink-0" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-800">
          <RiErrorWarningLine className="text-red-500 mr-3 text-xl flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Info Card */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <RiInformationLine className="text-blue-500 mr-3 mt-1 flex-shrink-0 text-xl" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Fee wallet addresses receive transaction fees from customer payments</li>
              <li>• Each network can have a different wallet address</li>
              <li>• If a network-specific wallet is not set, the default wallet will be used</li>
              <li>• Ensure wallet addresses are correct - sending to wrong addresses cannot be reversed</li>
              <li>• Changes take effect immediately for new transactions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Default Fee Wallet */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <RiWalletLine className="text-purple-600" />
          Default Fee Wallet
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          This address will be used for all networks that don't have a specific wallet configured
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Wallet Address
          </label>
          <input
            type="text"
            value={feeWallets.defaultFeeWallet}
            onChange={(e) => handleInputChange('defaultFeeWallet', e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm"
          />
        </div>
      </div>

      {/* Network-Specific Fee Wallets */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <RiWalletLine className="text-purple-600" />
          Network-Specific Fee Wallets
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Configure specific wallet addresses for each blockchain network
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(networkInfo).map(([network, info]) => (
            <div key={network} className="border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {info.name}
                <span className="text-xs text-gray-500 ml-2">({info.format})</span>
              </label>
              <input
                type="text"
                value={feeWallets[network]}
                onChange={(e) => handleInputChange(network, e.target.value)}
                placeholder={`Enter ${info.name} wallet address`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          <RiSave3Line className="text-xl" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Last Updated Info */}
      {settings && settings.updatedAt && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Last updated: {new Date(settings.updatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default PlatformSettings;
