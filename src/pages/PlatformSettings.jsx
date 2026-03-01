import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { URL } from '../url';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import {
  RiWalletLine,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiInformationLine,
  RiSave3Line,
  RiRefreshLine,
  RiSettings4Line,
  RiPercentLine,
  RiLinksLine,
  RiExternalLinkLine,
} from 'react-icons/ri';

const PlatformSettings = () => {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Default transaction fee percentage (displayed as %, stored as decimal)
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

  // On-chain sync state
  const [syncing, setSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState(null);

  const EXPLORER_TX_URLS = {
    base:      'https://basescan.org/tx/',
    bsc:       'https://bscscan.com/tx/',
    polygon:   'https://polygonscan.com/tx/',
    arbitrum:  'https://arbiscan.io/tx/',
    optimism:  'https://optimistic.etherscan.io/tx/',
    avalanche: 'https://snowtrace.io/tx/',
  };

  const handleSyncOnChain = async () => {
    setSyncing(true);
    setSyncResults(null);
    try {
      const response = await axios.post(
        `${URL}/api/admin/platform/wallet/sync-onchain`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      if (response.data.success) {
        setSyncResults(response.data.results);
        const updated = response.data.results.filter(r => r.success).length;
        const skipped = response.data.results.filter(r => r.skipped).length;
        const failed  = response.data.results.filter(r => !r.success && !r.skipped).length;
        if (failed === 0) {
          toast.success(`Sync complete: ${updated} updated, ${skipped} already set`);
        } else {
          toast.error(`Sync finished with ${failed} error(s)`);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to sync on-chain';
      toast.error(msg);
    } finally {
      setSyncing(false);
    }
  };

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

      // Convert percentage to decimal for storage (e.g., 1% -> 0.01)
      const feeAsDecimal = parseFloat(defaultFeePercentage) / 100;

      // Validate fee percentage
      if (isNaN(feeAsDecimal) || feeAsDecimal < 0.001 || feeAsDecimal > 0.10) {
        setErrorMessage('Fee percentage must be between 0.1% and 10%');
        setSaving(false);
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
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading platform settings...</p>
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
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <RiSettings4Line className="text-purple-600" />
              Platform Settings
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Configure fee wallet addresses for receiving transaction fees across different blockchain networks
            </p>
          </div>
          <button
            onClick={fetchPlatformSettings}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg transition-colors ${darkMode ? 'hover:bg-purple-900/30' : 'hover:bg-purple-50'}`}
          >
            <RiRefreshLine className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${darkMode ? 'bg-green-900/30 border border-green-700 text-green-400' : 'bg-green-50 border border-green-200 text-green-800'}`}>
          <RiCheckboxCircleFill className="text-green-500 mr-3 text-xl flex-shrink-0" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${darkMode ? 'bg-red-900/30 border border-red-700 text-red-400' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          <RiErrorWarningLine className="text-red-500 mr-3 text-xl flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Info Card */}
      <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-start">
          <RiInformationLine className="text-blue-500 mr-3 mt-1 flex-shrink-0 text-xl" />
          <div>
            <h3 className={`font-medium mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>Important Information</h3>
            <ul className={`text-sm space-y-1 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              <li>• Fee wallet addresses receive transaction fees from customer payments</li>
              <li>• Each network can have a different wallet address</li>
              <li>• If a network-specific wallet is not set, the default wallet will be used</li>
              <li>• Ensure wallet addresses are correct - sending to wrong addresses cannot be reversed</li>
              <li>• Changes take effect immediately for new transactions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Default Transaction Fee */}
      <div className={`rounded-lg shadow-md border p-6 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <RiPercentLine className="text-purple-600" />
          Default Transaction Fee
        </h2>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          This is the platform-wide default transaction fee applied to all merchants who don't have a custom fee set.
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
              className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-lg font-semibold ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
            <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>%</span>
          </div>
          <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Enter a value between 0.1% and 10%. Current: {defaultFeePercentage}% (merchants receive {(100 - parseFloat(defaultFeePercentage || 0)).toFixed(1)}%)
          </p>
        </div>
      </div>

      {/* Default Fee Wallet */}
      <div className={`rounded-lg shadow-md border p-6 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <RiWalletLine className="text-purple-600" />
          Default Fee Wallet
        </h2>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          This address will be used for all networks that don't have a specific wallet configured
        </p>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Default Wallet Address
          </label>
          <input
            type="text"
            value={feeWallets.defaultFeeWallet}
            onChange={(e) => handleInputChange('defaultFeeWallet', e.target.value)}
            placeholder="0x..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>
      </div>

      {/* Network-Specific Fee Wallets */}
      <div className={`rounded-lg shadow-md border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <RiWalletLine className="text-purple-600" />
          Network-Specific Fee Wallets
        </h2>
        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Configure specific wallet addresses for each blockchain network
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(networkInfo).map(([network, info]) => (
            <div key={network} className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {info.name}
                <span className={`text-xs ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>({info.format})</span>
              </label>
              <input
                type="text"
                value={feeWallets[network]}
                onChange={(e) => handleInputChange(network, e.target.value)}
                placeholder={`Enter ${info.name} wallet address`}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sync to Blockchain */}
      <div className={`rounded-lg shadow-md border p-6 mt-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <RiLinksLine className="text-purple-600" />
          Sync Fee Wallet to Blockchain
        </h2>
        <p className={`text-sm mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Pushes the configured fee wallets above to the on-chain factory contracts. Required after changing the default fee wallet.
          The sweeper wallet must be the factory owner to update.
        </p>

        <button
          onClick={handleSyncOnChain}
          disabled={syncing}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow"
        >
          <RiRefreshLine className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync to All Chains'}
        </button>

        {syncResults && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-2 pr-4 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chain</th>
                  <th className={`text-left py-2 pr-4 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                  <th className={`text-left py-2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {syncResults.map((r) => {
                  const explorerBase = EXPLORER_TX_URLS[r.network];
                  return (
                    <tr key={r.network} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <td className={`py-2.5 pr-4 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {r.name || r.network}
                      </td>
                      <td className="py-2.5 pr-4">
                        {r.success && (
                          <span className="flex items-center gap-1.5 text-green-500">
                            <RiCheckboxCircleFill /> Updated
                          </span>
                        )}
                        {r.skipped && (
                          <span className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ⏭️ Already set
                          </span>
                        )}
                        {!r.success && !r.skipped && (
                          <span className="flex items-center gap-1.5 text-red-500">
                            <RiErrorWarningLine /> {r.error || 'Failed'}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5">
                        {r.txHash ? (
                          <a
                            href={`${explorerBase}${r.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-500 hover:text-purple-400 font-mono text-xs"
                          >
                            {r.txHash.slice(0, 10)}...{r.txHash.slice(-6)}
                            <RiExternalLinkLine />
                          </a>
                        ) : (
                          <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
        <div className={`mt-4 text-sm text-right ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Last updated: {new Date(settings.updatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default PlatformSettings;
