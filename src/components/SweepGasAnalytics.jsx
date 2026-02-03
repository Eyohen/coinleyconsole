// src/components/SweepGasAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Fuel, RefreshCw, AlertCircle } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import axios from 'axios';
import { URL } from '../url';

const SweepGasAnalytics = () => {
  const { darkMode } = useDarkMode();

  // State
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState({});

  // Date filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch gas analytics
  const fetchGasAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      });

      const response = await axios.get(`${URL}/api/admin/sweep/gas-analytics?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });

      if (response.data?.success) {
        setAnalytics(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching gas analytics:', err);
      setError('Failed to load gas analytics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch crypto prices for USD conversion
  const fetchPrices = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,polygon-ecosystem-token,avalanche-2,monad&vs_currencies=usd'
      );

      setPrices({
        'ETH': response.data.ethereum?.usd || 0,
        'BNB': response.data.binancecoin?.usd || 0,
        'MATIC': response.data['polygon-ecosystem-token']?.usd || 0,
        'AVAX': response.data['avalanche-2']?.usd || 0,
        'MON': response.data.monad?.usd || 0
      });
    } catch (err) {
      console.error('Error fetching prices:', err);
    }
  };

  // Get USD value for gas
  const getUsdValue = (nativeAmount, network) => {
    // Map network names to symbols (handle variations)
    const symbolMap = {
      'Optimism': 'ETH',
      'Base': 'ETH',
      'Arbitrum': 'ETH',
      'Arbitrum One': 'ETH',
      'BSC': 'BNB',
      'Binance Smart Chain': 'BNB',
      'Polygon': 'MATIC',
      'Avalanche': 'AVAX',
      'Avalanche C-Chain': 'AVAX',
      'Monad': 'MON' // Monad uses MON for gas
    };

    const symbol = symbolMap[network];
    const price = prices[symbol];

    if (!price) return null;
    return parseFloat(nativeAmount) * price;
  };

  // Calculate total USD value
  const getTotalUsdValue = () => {
    if (!analytics?.networks) return 0;

    return analytics.networks.reduce((total, network) => {
      const usdValue = getUsdValue(network.totalGasNative, network.network);
      return total + (usdValue || 0);
    }, 0);
  };

  // Load data on mount
  useEffect(() => {
    fetchGasAnalytics();
    fetchPrices();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    fetchGasAnalytics();
    fetchPrices();
  };

  // Handle filter apply
  const handleApplyFilters = () => {
    fetchGasAnalytics();
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    // Refetch without filters
    setLoading(true);
    axios.get(`${URL}/api/admin/sweep/gas-analytics`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
    .then(response => {
      if (response.data?.success) {
        setAnalytics(response.data.data);
      }
    })
    .catch(err => {
      console.error('Error:', err);
      setError('Failed to load analytics');
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className={`rounded-lg shadow-sm p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Fuel size={24} className="text-[#7042D2]" />
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Gas Usage Analytics
            </h2>
          </div>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track gas fees spent on sweeping deposit addresses
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`p-2 rounded-md ${
            darkMode
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Refresh analytics"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Date Filters */}
      <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar size={18} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Date Range:
            </span>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`px-3 py-2 rounded-md text-sm ${
              darkMode
                ? 'bg-gray-600 border-gray-500 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            } border focus:outline-none focus:ring-2 focus:ring-[#7042D2]`}
          />
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`px-3 py-2 rounded-md text-sm ${
              darkMode
                ? 'bg-gray-600 border-gray-500 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            } border focus:outline-none focus:ring-2 focus:ring-[#7042D2]`}
          />
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-[#7042D2] text-white rounded-md text-sm hover:bg-opacity-90"
          >
            Apply
          </button>
          <button
            onClick={handleResetFilters}
            className={`px-4 py-2 rounded-md text-sm ${
              darkMode
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } border`}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
        </div>
      ) : analytics ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Gas Spent (USD)
                </span>
                <TrendingUp size={18} className="text-[#7042D2]" />
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ${getTotalUsdValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Payments Swept
                </span>
                <Fuel size={18} className="text-green-600" />
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {analytics.summary?.totalPaymentsSwept || 0}
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Networks Used
                </span>
                <Calendar size={18} className="text-blue-600" />
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {analytics.summary?.networksUsed || 0}
              </div>
            </div>
          </div>

          {/* Network Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left border-b ${
                  darkMode ? 'text-gray-300 bg-gray-700 border-gray-600' : 'text-gray-500 bg-gray-50 border-gray-200'
                }`}>
                  <th className="px-6 py-3 font-medium">Network</th>
                  <th className="px-6 py-3 font-medium">Total Gas (Native)</th>
                  <th className="px-6 py-3 font-medium">Total Gas (USD)</th>
                  <th className="px-6 py-3 font-medium">Payments</th>
                  <th className="px-6 py-3 font-medium">Avg Gas/Payment</th>
                </tr>
              </thead>
              <tbody>
                {analytics.networks?.map((network) => {
                  const usdValue = getUsdValue(network.totalGasNative, network.network);

                  return (
                    <tr
                      key={network.chainId}
                      className={`border-b ${
                        darkMode
                          ? 'border-gray-700 hover:bg-gray-700'
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <td className={`px-6 py-4 font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {network.network}
                      </td>
                      <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {parseFloat(network.totalGasNative).toFixed(6)} {
                          network.network === 'Binance Smart Chain' || network.network === 'BSC' ? 'BNB' :
                          network.network === 'Polygon' ? 'MATIC' :
                          network.network === 'Avalanche' || network.network === 'Avalanche C-Chain' ? 'AVAX' :
                          network.network === 'Monad' ? 'MON' :
                          'ETH'
                        }
                      </td>
                      <td className={`px-6 py-4 font-medium text-green-600`}>
                        {usdValue ? `$${usdValue.toFixed(2)}` : '-'}
                      </td>
                      <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {network.totalPayments}
                      </td>
                      <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {parseFloat(network.avgGasPerPayment).toFixed(6)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {analytics.networks?.length === 0 && (
            <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Fuel size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-lg">No gas usage data</p>
              <p className="text-sm mt-2">Gas analytics will appear once payments are swept</p>
            </div>
          )}
        </>
      ) : (
        <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-lg">No data available</p>
        </div>
      )}
    </div>
  );
};

export default SweepGasAnalytics;
