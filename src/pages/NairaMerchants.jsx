import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL as BASE_URL } from '../url';
import { useDarkMode } from '../context/DarkModeContext';
import {
  RiSearchLine,
  RiAddCircleLine,
  RiWalletLine,
  RiBankLine,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiCloseLine,
  RiRefreshLine,
  RiUserLine,
  RiMailLine,
  RiBuilding4Line,
  RiEyeLine,
  RiEditLine
} from 'react-icons/ri';

const NairaMerchants = () => {
  const { darkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('merchants');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Merchants list
  const [merchants, setMerchants] = useState([]);
  const [allMerchants, setAllMerchants] = useState([]); // For adding new naira merchants

  // Selected merchant for wallet management
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletForm, setWalletForm] = useState({
    ethereum: '',
    bsc: '',
    polygon: '',
    arbitrum: '',
    optimism: '',
    avalanche: '',
    base: '',
    tron: '',
    solana: ''
  });

  // Add merchant modal (convert existing)
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMerchantToAdd, setSelectedMerchantToAdd] = useState('');

  // Create new merchant modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    businessName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [createErrors, setCreateErrors] = useState({});

  const token = localStorage.getItem('access_token');
  const headers = { Authorization: `Bearer ${token}` };

  // Dark mode styles
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const tableHeaderBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
  const tableRowHover = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const tableBorder = darkMode ? 'divide-gray-700 border-gray-700' : 'divide-gray-200 border-gray-200';

  useEffect(() => {
    fetchNairaMerchants();
    fetchAllMerchants();
  }, []);

  const fetchNairaMerchants = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BASE_URL}/api/admin/naira-merchants`, { headers });
      if (response.data?.success) {
        setMerchants(response.data.merchants || []);
      }
    } catch (err) {
      console.error('Error fetching naira merchants:', err);
      // If endpoint doesn't exist yet, show empty state
      if (err.response?.status === 404) {
        setMerchants([]);
      } else {
        setError(err.response?.data?.error || 'Failed to fetch naira merchants');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMerchants = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/merchants`, { headers });
      if (response.data?.success) {
        // Filter out merchants that are already naira merchants
        setAllMerchants(response.data.merchants || []);
      }
    } catch (err) {
      console.error('Error fetching all merchants:', err);
    }
  };

  const handleAddNairaMerchant = async () => {
    if (!selectedMerchantToAdd) {
      setError('Please select a merchant');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post(
        `${BASE_URL}/api/admin/naira-merchants`,
        { merchantId: selectedMerchantToAdd },
        { headers }
      );

      if (response.data?.success) {
        setSuccess('Merchant added as Naira Merchant successfully!');
        setShowAddModal(false);
        setSelectedMerchantToAdd('');
        fetchNairaMerchants();
        fetchAllMerchants();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add naira merchant');
    } finally {
      setLoading(false);
    }
  };

  // Create a new naira merchant account
  const handleCreateNairaMerchant = async () => {
    // Validate form
    const errors = {};
    if (!createForm.businessName) errors.businessName = 'Business name is required';
    if (!createForm.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(createForm.email)) errors.email = 'Invalid email format';
    if (!createForm.password) errors.password = 'Password is required';
    else if (createForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!createForm.firstName) errors.firstName = 'First name is required';
    if (!createForm.lastName) errors.lastName = 'Last name is required';

    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setCreateErrors({});

      const response = await axios.post(
        `${BASE_URL}/api/admin/naira-merchants/create`,
        createForm,
        { headers }
      );

      if (response.data?.success) {
        setSuccess('Naira merchant account created successfully! They can now login to the merchant platform.');
        setShowCreateModal(false);
        setCreateForm({
          businessName: '',
          email: '',
          password: '',
          firstName: '',
          lastName: ''
        });
        fetchNairaMerchants();
        fetchAllMerchants();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create naira merchant');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveNairaMerchant = async (merchantId) => {
    if (!window.confirm('Are you sure you want to remove this merchant from Naira Merchants? They will need to manage their own wallet addresses again.')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.delete(
        `${BASE_URL}/api/admin/naira-merchants/${merchantId}`,
        { headers }
      );

      if (response.data?.success) {
        setSuccess('Merchant removed from Naira Merchants');
        fetchNairaMerchants();
        fetchAllMerchants();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove naira merchant');
    } finally {
      setLoading(false);
    }
  };

  const openWalletModal = (merchant) => {
    setSelectedMerchant(merchant);
    // Pre-populate wallet form with existing admin-managed wallets
    setWalletForm({
      ethereum: merchant.adminManagedWallets?.ethereum || '',
      bsc: merchant.adminManagedWallets?.bsc || '',
      polygon: merchant.adminManagedWallets?.polygon || '',
      arbitrum: merchant.adminManagedWallets?.arbitrum || '',
      optimism: merchant.adminManagedWallets?.optimism || '',
      avalanche: merchant.adminManagedWallets?.avalanche || '',
      base: merchant.adminManagedWallets?.base || '',
      tron: merchant.adminManagedWallets?.tron || '',
      solana: merchant.adminManagedWallets?.solana || ''
    });
    setShowWalletModal(true);
  };

  const handleSaveWallets = async () => {
    if (!selectedMerchant) return;

    try {
      setLoading(true);
      setError('');
      const response = await axios.put(
        `${BASE_URL}/api/admin/naira-merchants/${selectedMerchant.id}/wallets`,
        { wallets: walletForm },
        { headers }
      );

      if (response.data?.success) {
        setSuccess('Wallet addresses updated successfully!');
        setShowWalletModal(false);
        fetchNairaMerchants();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update wallet addresses');
    } finally {
      setLoading(false);
    }
  };

  // Filter merchants based on search
  const filteredMerchants = merchants.filter(merchant =>
    merchant.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get available merchants (not already naira merchants)
  const availableMerchants = allMerchants.filter(
    m => !merchants.find(nm => nm.id === m.id)
  );

  const networkInfo = {
    ethereum: { name: 'Ethereum', format: '0x...' },
    bsc: { name: 'BSC', format: '0x...' },
    polygon: { name: 'Polygon', format: '0x...' },
    arbitrum: { name: 'Arbitrum', format: '0x...' },
    optimism: { name: 'Optimism', format: '0x...' },
    avalanche: { name: 'Avalanche', format: '0x...' },
    base: { name: 'Base', format: '0x...' },
    tron: { name: 'TRON', format: 'T...' },
    solana: { name: 'Solana', format: 'Base58' }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${textPrimary}`}>Naira Merchants</h1>
        <p className={textSecondary}>
          Manage merchants who receive Naira settlements instead of crypto. You manage their receiving wallets.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className={`mb-4 p-4 ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg flex items-center justify-between`}>
          <div className="flex items-center">
            <RiErrorWarningLine className="text-red-500 mr-2" />
            <span className="text-red-500">{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-500">
            <RiCloseLine />
          </button>
        </div>
      )}
      {success && (
        <div className={`mb-4 p-4 ${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg flex items-center justify-between`}>
          <div className="flex items-center">
            <RiCheckboxCircleFill className="text-green-500 mr-2" />
            <span className="text-green-500">{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="text-green-500">
            <RiCloseLine />
          </button>
        </div>
      )}

      {/* Info Card */}
      <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
        <h3 className={`font-medium mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>
          How Naira Merchants Work
        </h3>
        <ul className={`text-sm space-y-1 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
          <li>1. Customer pays in crypto/stablecoins</li>
          <li>2. Funds go to admin-managed wallets (set below for each merchant)</li>
          <li>3. Admin converts and disburses NGN to merchant's bank account</li>
          <li>4. Merchant manages their bank account details in their dashboard</li>
        </ul>
      </div>

      {/* Actions Bar */}
      <div className={`${cardBg} rounded-lg shadow p-4 mb-6`}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <RiSearchLine className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
            <input
              type="text"
              placeholder="Search merchants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${inputBg}`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={fetchNairaMerchants}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${textPrimary}`}
            >
              <RiRefreshLine className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#7042D2] text-white rounded-lg hover:bg-opacity-90"
            >
              <RiAddCircleLine />
              Create New Merchant
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Convert Existing
            </button>
          </div>
        </div>
      </div>

      {/* Merchants Table */}
      <div className={`${cardBg} rounded-lg shadow overflow-hidden`}>
        {loading && merchants.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7042D2]"></div>
          </div>
        ) : filteredMerchants.length === 0 ? (
          <div className={`text-center py-12 ${textSecondary}`}>
            <RiBankLine className="mx-auto text-4xl mb-3 opacity-50" />
            <p>No naira merchants found</p>
            <p className="text-sm mt-1">Add merchants to manage their crypto wallets and bank settlements</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={tableHeaderBg}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Business</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Email</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Status</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Wallets Configured</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Bank Account</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${tableBorder}`}>
                {filteredMerchants.map((merchant) => {
                  const configuredWallets = Object.values(merchant.adminManagedWallets || {}).filter(w => w).length;
                  return (
                    <tr key={merchant.id} className={tableRowHover}>
                      <td className={`px-4 py-3 ${textPrimary}`}>
                        <div className="flex items-center gap-2">
                          <RiBuilding4Line className={textSecondary} />
                          <span className="font-medium">{merchant.businessName}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 ${textSecondary}`}>{merchant.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          merchant.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {merchant.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          configuredWallets > 0
                            ? 'bg-blue-100 text-blue-800'
                            : darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {configuredWallets > 0 ? `${configuredWallets} networks` : 'Not configured'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          merchant.bankAccount
                            ? 'bg-green-100 text-green-800'
                            : darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {merchant.bankAccount ? 'Configured' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openWalletModal(merchant)}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-[#7042D2] text-white rounded hover:bg-opacity-90"
                          >
                            <RiWalletLine />
                            Manage Wallets
                          </button>
                          <button
                            onClick={() => handleRemoveNairaMerchant(merchant.id)}
                            className={`px-3 py-1 text-sm rounded ${
                              darkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Merchant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} rounded-lg p-6 max-w-md w-full mx-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Add Naira Merchant</h3>
              <button onClick={() => setShowAddModal(false)} className={textSecondary}>
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            <p className={`text-sm mb-4 ${textSecondary}`}>
              Select a merchant to convert to a Naira Merchant. You will manage their receiving crypto wallets.
            </p>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>
                Select Merchant
              </label>
              <select
                value={selectedMerchantToAdd}
                onChange={(e) => setSelectedMerchantToAdd(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${inputBg}`}
              >
                <option value="">Choose a merchant...</option>
                {availableMerchants.map((merchant) => (
                  <option key={merchant.id} value={merchant.id}>
                    {merchant.businessName} ({merchant.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddNairaMerchant}
                disabled={loading || !selectedMerchantToAdd}
                className="px-4 py-2 bg-[#7042D2] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Merchant'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Management Modal */}
      {showWalletModal && selectedMerchant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className={`${cardBg} rounded-lg p-6 max-w-2xl w-full mx-4 my-8`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold ${textPrimary}`}>
                  Manage Wallets - {selectedMerchant.businessName}
                </h3>
                <p className={`text-sm ${textSecondary}`}>
                  These wallets will receive crypto payments for this merchant
                </p>
              </div>
              <button onClick={() => setShowWalletModal(false)} className={textSecondary}>
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(networkInfo).map(([network, info]) => (
                <div key={network} className={`p-3 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <label className={`block text-sm font-medium mb-1 ${textPrimary}`}>
                    {info.name}
                    <span className={`text-xs ml-2 ${textSecondary}`}>({info.format})</span>
                  </label>
                  <input
                    type="text"
                    value={walletForm[network]}
                    onChange={(e) => setWalletForm({ ...walletForm, [network]: e.target.value })}
                    placeholder={`Enter ${info.name} wallet address`}
                    className={`w-full px-3 py-2 border rounded-lg font-mono text-sm ${inputBg}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowWalletModal(false)}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWallets}
                disabled={loading}
                className="px-4 py-2 bg-[#7042D2] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Wallets'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Merchant Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className={`${cardBg} rounded-lg p-6 max-w-lg w-full mx-4 my-8`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold ${textPrimary}`}>Create New Naira Merchant</h3>
                <p className={`text-sm ${textSecondary}`}>
                  Create a new merchant account that will receive Naira settlements
                </p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className={textSecondary}>
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Business Name */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>
                  Business Name *
                </label>
                <input
                  type="text"
                  value={createForm.businessName}
                  onChange={(e) => setCreateForm({ ...createForm, businessName: e.target.value })}
                  placeholder="Enter business name"
                  className={`w-full px-3 py-2 border rounded-lg ${inputBg} ${createErrors.businessName ? 'border-red-500' : ''}`}
                />
                {createErrors.businessName && (
                  <p className="text-red-500 text-xs mt-1">{createErrors.businessName}</p>
                )}
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.firstName}
                    onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                    placeholder="First name"
                    className={`w-full px-3 py-2 border rounded-lg ${inputBg} ${createErrors.firstName ? 'border-red-500' : ''}`}
                  />
                  {createErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{createErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.lastName}
                    onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                    placeholder="Last name"
                    className={`w-full px-3 py-2 border rounded-lg ${inputBg} ${createErrors.lastName ? 'border-red-500' : ''}`}
                  />
                  {createErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{createErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="merchant@example.com"
                  className={`w-full px-3 py-2 border rounded-lg ${inputBg} ${createErrors.email ? 'border-red-500' : ''}`}
                />
                {createErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{createErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>
                  Password *
                </label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className={`w-full px-3 py-2 border rounded-lg ${inputBg} ${createErrors.password ? 'border-red-500' : ''}`}
                />
                {createErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{createErrors.password}</p>
                )}
              </div>

              {/* Info */}
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  The merchant will be able to login with this email and password. Their account will be pre-verified and set as a Naira merchant.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({ businessName: '', email: '', password: '', firstName: '', lastName: '' });
                  setCreateErrors({});
                }}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNairaMerchant}
                disabled={loading}
                className="px-4 py-2 bg-[#7042D2] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Merchant'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NairaMerchants;
