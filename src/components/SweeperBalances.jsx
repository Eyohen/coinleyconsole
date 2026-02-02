// src/components/SweeperBalances.jsx
import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, AlertCircle, DollarSign } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import axios from 'axios';

const SweeperBalances = ({ balances = [], loading = false, onRefresh }) => {
  const { darkMode } = useDarkMode();
  const [copySuccess, setCopySuccess] = useState('');
  const [prices, setPrices] = useState({});
  const [pricesLoading, setPricesLoading] = useState(false);

  const getStatusColor = (balance) => {
    const bal = parseFloat(balance);
    if (bal >= 0.001) return 'green';
    if (bal > 0) return 'yellow';
    return 'red';
  };

  const getStatusLabel = (balance) => {
    const bal = parseFloat(balance);
    if (bal >= 0.001) return 'OK';
    if (bal > 0) return 'Low';
    return 'Empty';
  };

  const copyToClipboard = (address) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopySuccess(address);
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Map token symbols to CoinGecko IDs
  const getCoinGeckoId = (symbol) => {
    const mapping = {
      'ETH': 'ethereum',
      'BNB': 'binancecoin',
      'MATIC': 'polygon-ecosystem-token', // POL (ex-MATIC) - updated token name
      'AVAX': 'avalanche-2',
      'MONAD': 'monad' // Add when available on CoinGecko
    };
    return mapping[symbol] || symbol.toLowerCase();
  };

  // Fetch crypto prices from CoinGecko
  const fetchPrices = async () => {
    if (balances.length === 0) return;

    setPricesLoading(true);
    try {
      // Get unique coin IDs
      const coinIds = [...new Set(balances.map(bal => getCoinGeckoId(bal.symbol)))].join(',');

      console.log('Fetching prices for:', coinIds);

      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
      );

      console.log('CoinGecko response:', response.data);
      setPrices(response.data);
    } catch (err) {
      console.error('Error fetching prices:', err);
      console.error('Error details:', err.response?.data);
    } finally {
      setPricesLoading(false);
    }
  };

  // Fetch prices when balances change
  useEffect(() => {
    if (balances.length > 0) {
      fetchPrices();
    }
  }, [balances]);

  // Calculate USD value
  const getUsdValue = (balance, symbol) => {
    const coinId = getCoinGeckoId(symbol);
    const price = prices[coinId]?.usd;
    if (!price) return null;
    return parseFloat(balance) * price;
  };

  // Calculate total USD value
  const getTotalUsdValue = () => {
    return balances.reduce((total, bal) => {
      const usdValue = getUsdValue(bal.balance, bal.symbol);
      return total + (usdValue || 0);
    }, 0);
  };

  return (
    <>
      <div className={`rounded-lg shadow-sm p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Sweeper Wallet Balances
            </h2>
            {!loading && balances.length > 0 && (
              <div className={`flex items-center gap-2 mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <DollarSign size={16} />
                <span className="text-sm">
                  Total: {pricesLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <span className="font-semibold">
                      ${getTotalUsdValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              onRefresh();
              fetchPrices();
            }}
            disabled={loading}
            className={`p-2 rounded-md ${
              darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Refresh balances"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
          </div>
        ) : !balances || balances.length === 0 ? (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-lg">No balance data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {balances.map((bal) => {
              const status = getStatusColor(bal.balance);
              const statusLabel = getStatusLabel(bal.balance);
              const usdValue = getUsdValue(bal.balance, bal.symbol);

              return (
                <div
                  key={bal.network}
                  className={`p-4 border rounded-lg ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  {/* Network name and status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {bal.network}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === 'green'
                          ? 'bg-green-100 text-green-800'
                          : status === 'yellow'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  {/* Balance */}
                  <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {parseFloat(bal.balance).toFixed(6)} {bal.symbol}
                  </div>

                  {/* USD Value */}
                  {usdValue !== null && (
                    <div className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ≈ ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </div>
                  )}

                  {/* Wallet address with copy button */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {bal.walletAddress.substring(0, 6)}...{bal.walletAddress.substring(38)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(bal.walletAddress)}
                      className={`${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title="Copy wallet address"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Copy success toast */}
      {copySuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          Copied to clipboard!
        </div>
      )}
    </>
  );
};

export default SweeperBalances;
