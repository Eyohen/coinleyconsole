import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL as BASE_URL } from '../url';
import { useDarkMode } from '../context/DarkModeContext';

const P2PAdmin = () => {
  const { darkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dashboard stats
  const [stats, setStats] = useState(null);

  // Rates
  const [rates, setRates] = useState({ currentRates: [], history: [] });
  const [newRate, setNewRate] = useState({ token: 'USDT', rate: '', notes: '' });

  // Transactions
  const [transactions, setTransactions] = useState({ transactions: [], pagination: {} });
  const [txFilters, setTxFilters] = useState({ page: 1, status: '', merchantId: '' });

  // Merchants
  const [merchants, setMerchants] = useState([]);

  // NumeroBalance
  const [numeroBalance, setNumeroBalance] = useState(null);

  const token = localStorage.getItem('access_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'rates') fetchRates();
    if (activeTab === 'transactions') fetchTransactions();
    if (activeTab === 'merchants') fetchMerchants();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BASE_URL}/api/admin/p2p/stats`, { headers });
      if (response.data?.success && response.data?.data) {
        setStats(response.data.data);
      } else {
        setStats(null);
      }
      try {
        const balanceRes = await axios.get(`${BASE_URL}/api/admin/p2p/numero-balance`, { headers });
        if (balanceRes.data?.success && balanceRes.data?.data) {
          setNumeroBalance(balanceRes.data.data);
        }
      } catch (e) {
        console.log('Numero balance not available');
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
      const errorMsg = err.response?.data?.error || 'Failed to fetch stats. Make sure P2P tables are migrated.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BASE_URL}/api/admin/p2p/rates`, { headers });
      if (response.data?.success && response.data?.data) {
        setRates(response.data.data);
      } else {
        setRates({ currentRates: [], history: [] });
      }
    } catch (err) {
      console.error('Rates fetch error:', err);
      const errorMsg = err.response?.data?.error || 'Failed to fetch rates';
      setError(errorMsg);
      setRates({ currentRates: [], history: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      params.append('page', txFilters.page);
      if (txFilters.status) params.append('status', txFilters.status);
      if (txFilters.merchantId) params.append('merchantId', txFilters.merchantId);

      const response = await axios.get(`${BASE_URL}/api/admin/p2p/transactions?${params}`, { headers });
      if (response.data?.success && response.data?.data) {
        setTransactions(response.data.data);
      } else {
        setTransactions({ transactions: [], pagination: {} });
      }
    } catch (err) {
      console.error('Transactions fetch error:', err);
      const errorMsg = err.response?.data?.error || 'Failed to fetch transactions';
      setError(errorMsg);
      setTransactions({ transactions: [], pagination: {} });
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BASE_URL}/api/admin/p2p/merchants`, { headers });
      if (response.data?.success && response.data?.data?.merchants) {
        setMerchants(response.data.data.merchants);
      } else {
        setMerchants([]);
      }
    } catch (err) {
      console.error('Merchants fetch error:', err);
      const errorMsg = err.response?.data?.error || 'Failed to fetch merchants';
      setError(errorMsg);
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSetRate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await axios.post(`${BASE_URL}/api/admin/p2p/rates`, newRate, { headers });
      setSuccess(`Rate updated: 1 ${newRate.token} = ₦${newRate.rate}`);
      setNewRate({ token: 'USDT', rate: '', notes: '' });
      fetchRates();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set rate');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleP2P = async (merchantId, enabled) => {
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/admin/p2p/merchant/${merchantId}/toggle`, { enabled }, { headers });
      setSuccess(`P2P ${enabled ? 'enabled' : 'disabled'} for merchant`);
      fetchMerchants();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to toggle P2P');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncBanks = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/admin/p2p/sync-banks`, {}, { headers });
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sync banks');
    } finally {
      setLoading(false);
    }
  };

  // Dark mode styles
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const textMuted = darkMode ? 'text-gray-500' : 'text-gray-400';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const tableHeaderBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
  const tableRowHover = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const tableBorder = darkMode ? 'divide-gray-700 border-gray-700' : 'divide-gray-200 border-gray-200';

  const renderDashboard = () => (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard darkMode={darkMode} title="Today's Transactions" value={stats.todayTransactions} />
          <StatCard darkMode={darkMode} title="Today's Volume" value={`$${stats.todayVolume}`} />
          <StatCard darkMode={darkMode} title="Monthly Volume" value={`$${stats.monthlyVolume}`} />
          <StatCard darkMode={darkMode} title="Pending" value={stats.pendingCount} highlight={stats.pendingCount > 0} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${cardBg} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Current Exchange Rates</h3>
          {stats?.currentRates?.length > 0 ? (
            <div className="space-y-2">
              {stats.currentRates.map((rate, idx) => (
                <div key={idx} className={`flex justify-between items-center p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                  <span className={`font-medium ${textPrimary}`}>{rate.token}</span>
                  <span className="text-green-500 font-bold">{rate.display}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={textSecondary}>No rates configured yet</p>
          )}
        </div>

        <div className={`${cardBg} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>UseNumero Balance</h3>
          {numeroBalance ? (
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{numeroBalance.display}</p>
              <p className={`${textSecondary} mt-2`}>Available for disbursement</p>
            </div>
          ) : (
            <p className={textSecondary}>Unable to fetch balance</p>
          )}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard darkMode={darkMode} title="Total Transactions" value={stats.totalTransactions} />
          <StatCard darkMode={darkMode} title="Active Merchants" value={stats.activeMerchants} />
          <StatCard darkMode={darkMode} title="Failed Today" value={stats.failedToday} highlight={stats.failedToday > 0} isError />
        </div>
      )}
    </div>
  );

  const renderRates = () => (
    <div className="space-y-6">
      <div className={`${cardBg} rounded-lg shadow p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Set Exchange Rate</h3>
        <form onSubmit={handleSetRate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>Token</label>
              <select
                value={newRate.token}
                onChange={(e) => setNewRate({ ...newRate, token: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${inputBg}`}
              >
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>Rate (NGN)</label>
              <input
                type="number"
                value={newRate.rate}
                onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
                placeholder="e.g., 1650"
                className={`w-full px-3 py-2 border rounded-lg ${inputBg}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-1`}>Notes</label>
              <input
                type="text"
                value={newRate.notes}
                onChange={(e) => setNewRate({ ...newRate, notes: e.target.value })}
                placeholder="Optional notes"
                className={`w-full px-3 py-2 border rounded-lg ${inputBg}`}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Set Rate
          </button>
        </form>
      </div>

      <div className={`${cardBg} rounded-lg shadow p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Current Active Rates</h3>
        <div className="space-y-2">
          {rates.currentRates?.map((rate, idx) => (
            <div key={idx} className={`flex justify-between items-center p-4 ${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} rounded-lg border`}>
              <div>
                <span className={`font-bold text-lg ${textPrimary}`}>{rate.token}</span>
                <span className={`${textSecondary} ml-2`}>→ {rate.targetCurrency}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-500">{rate.display}</span>
                <p className={`text-xs ${textMuted}`}>Since {new Date(rate.effectiveFrom).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${cardBg} rounded-lg shadow p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Rate History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={tableHeaderBg}>
              <tr>
                <th className={`px-4 py-2 text-left ${textSecondary}`}>Token</th>
                <th className={`px-4 py-2 text-left ${textSecondary}`}>Rate</th>
                <th className={`px-4 py-2 text-left ${textSecondary}`}>Status</th>
                <th className={`px-4 py-2 text-left ${textSecondary}`}>Effective From</th>
                <th className={`px-4 py-2 text-left ${textSecondary}`}>Notes</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${tableBorder}`}>
              {rates.history?.map((rate, idx) => (
                <tr key={idx} className={tableRowHover}>
                  <td className={`px-4 py-2 ${textPrimary}`}>{rate.token}</td>
                  <td className={`px-4 py-2 font-mono ${textPrimary}`}>₦{rate.rate}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${rate.isActive ? 'bg-green-100 text-green-800' : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {rate.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className={`px-4 py-2 ${textSecondary}`}>{new Date(rate.effectiveFrom).toLocaleString()}</td>
                  <td className={`px-4 py-2 ${textMuted}`}>{rate.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className={`${cardBg} rounded-lg shadow p-4`}>
        <div className="flex gap-4 items-end">
          <div>
            <label className={`block text-sm font-medium ${textSecondary} mb-1`}>Status</label>
            <select
              value={txFilters.status}
              onChange={(e) => setTxFilters({ ...txFilters, status: e.target.value, page: 1 })}
              className={`px-3 py-2 border rounded-lg ${inputBg}`}
            >
              <option value="">All</option>
              <option value="pending_crypto">Pending Crypto</option>
              <option value="processing">Processing</option>
              <option value="disbursing">Disbursing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <button
            onClick={fetchTransactions}
            className={`px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-800 hover:bg-gray-900'} text-white rounded-lg`}
          >
            Filter
          </button>
        </div>
      </div>

      <div className={`${cardBg} rounded-lg shadow overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={tableHeaderBg}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Reference</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Merchant</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Amount</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>NGN</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Bank</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Status</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${tableBorder}`}>
              {transactions.transactions?.map((tx) => (
                <tr key={tx.id} className={tableRowHover}>
                  <td className={`px-4 py-3 font-mono text-sm ${textPrimary}`}>{tx.referenceId}</td>
                  <td className={`px-4 py-3 ${textPrimary}`}>{tx.merchant || 'N/A'}</td>
                  <td className={`px-4 py-3 ${textPrimary}`}>{tx.sourceAmount} {tx.sourceToken}</td>
                  <td className={`px-4 py-3 font-semibold ${textPrimary}`}>₦{tx.targetAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className={textPrimary}>{tx.bankName}</div>
                    <div className={textSecondary}>{tx.accountNumber}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tx.status} darkMode={darkMode} />
                  </td>
                  <td className={`px-4 py-3 text-sm ${textSecondary}`}>
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.pagination && (
          <div className={`px-4 py-3 border-t ${tableBorder} flex justify-between items-center`}>
            <span className={`text-sm ${textSecondary}`}>
              Page {transactions.pagination.page} of {transactions.pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setTxFilters({ ...txFilters, page: txFilters.page - 1 })}
                disabled={txFilters.page <= 1}
                className={`px-3 py-1 border rounded disabled:opacity-50 ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
              >
                Previous
              </button>
              <button
                onClick={() => setTxFilters({ ...txFilters, page: txFilters.page + 1 })}
                disabled={txFilters.page >= transactions.pagination.totalPages}
                className={`px-3 py-1 border rounded disabled:opacity-50 ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMerchants = () => (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleSyncBanks}
          disabled={loading}
          className={`px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-800 hover:bg-gray-900'} text-white rounded-lg`}
        >
          Sync Nigerian Banks
        </button>
      </div>

      <div className={`${cardBg} rounded-lg shadow overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={tableHeaderBg}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Business Name</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Email</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Status</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>P2P Enabled</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${tableBorder}`}>
              {merchants?.map((merchant) => (
                <tr key={merchant.id} className={tableRowHover}>
                  <td className={`px-4 py-3 font-medium ${textPrimary}`}>{merchant.businessName}</td>
                  <td className={`px-4 py-3 ${textPrimary}`}>{merchant.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      merchant.status === 'active' ? 'bg-green-100 text-green-800' : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {merchant.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      merchant.p2pEnabled ? 'bg-green-100 text-green-800' : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {merchant.p2pEnabled ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleP2P(merchant.id, !merchant.p2pEnabled)}
                      disabled={loading}
                      className={`px-3 py-1 rounded text-sm ${
                        merchant.p2pEnabled
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {merchant.p2pEnabled ? 'Disable P2P' : 'Enable P2P'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${textPrimary}`}>P2P Offramp Management</h1>
        <p className={textSecondary}>Manage stablecoin to Naira conversions</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className={`mb-4 p-4 ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border text-red-500 rounded-lg`}>
          {error}
          <button onClick={() => setError('')} className="float-right">&times;</button>
        </div>
      )}
      {success && (
        <div className={`mb-4 p-4 ${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} border text-green-500 rounded-lg`}>
          {success}
          <button onClick={() => setSuccess('')} className="float-right">&times;</button>
        </div>
      )}

      {/* Tabs */}
      <div className={`mb-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <nav className="flex gap-4">
          {['dashboard', 'rates', 'transactions', 'merchants'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? 'text-green-500 border-b-2 border-green-500'
                  : `${textSecondary} hover:${textPrimary}`
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      )}

      {!loading && activeTab === 'dashboard' && renderDashboard()}
      {!loading && activeTab === 'rates' && renderRates()}
      {!loading && activeTab === 'transactions' && renderTransactions()}
      {!loading && activeTab === 'merchants' && renderMerchants()}
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, highlight, isError, darkMode }) => (
  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 ${highlight ? (isError ? 'border-l-4 border-red-500' : 'border-l-4 border-yellow-500') : ''}`}>
    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
    <p className={`text-2xl font-bold ${isError && highlight ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
  </div>
);

const StatusBadge = ({ status, darkMode }) => {
  const colors = {
    pending_crypto: 'bg-yellow-100 text-yellow-800',
    crypto_received: 'bg-blue-100 text-blue-800',
    processing: 'bg-blue-100 text-blue-800',
    disbursing: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-800',
    cancelled: darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100')}`}>
      {status?.replace('_', ' ')}
    </span>
  );
};

export default P2PAdmin;
