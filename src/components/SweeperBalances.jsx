// src/components/SweeperBalances.jsx
//
// Renders sweeper-wallet balances for every CREATE2 sweep chain. All numbers
// (severity, USD value, sweeps remaining) come from the server's
// /api/admin/sweep/balances endpoint, which delegates to SweeperHealthService
// so the dashboard and the gasMonitor cron agree on chain state.
//
// Previously this component hit CoinGecko free-tier from the browser with a
// hardcoded ID map. That was rate-limited, leaked the call origin, and
// silently dropped Monad (no listing). Server-side resolution removes all of
// those concerns.

import React, { useState } from 'react';
import { RefreshCw, Copy, AlertCircle, DollarSign } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';

const SEVERITY_DISPLAY = {
  healthy:  { label: 'OK',       light: 'bg-green-100 text-green-800',     dark: 'bg-green-900/40 text-green-300'   },
  warning:  { label: 'Low',      light: 'bg-yellow-100 text-yellow-800',   dark: 'bg-yellow-900/40 text-yellow-300' },
  critical: { label: 'Critical', light: 'bg-red-100 text-red-800',         dark: 'bg-red-900/40 text-red-300'       },
  empty:    { label: 'Empty',    light: 'bg-red-200 text-red-900',         dark: 'bg-red-900/60 text-red-200'       },
  unknown:  { label: 'RPC',      light: 'bg-gray-200 text-gray-800',       dark: 'bg-gray-700 text-gray-200'        },
};

const formatNative = (value, decimals = 6) => {
  if (value == null) return '—';
  const n = parseFloat(value);
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(decimals);
};

const formatUsd = (value) => {
  if (value == null || !Number.isFinite(value)) return null;
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const SweeperBalances = ({ balances = [], loading = false, onRefresh }) => {
  const { darkMode } = useDarkMode();
  const [copySuccess, setCopySuccess] = useState('');

  const copyToClipboard = (address) => {
    if (!address) return;
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopySuccess(address);
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => console.error('Failed to copy address:', err));
  };

  const totalUsd = balances.reduce((total, b) => {
    return typeof b.usdValue === 'number' && Number.isFinite(b.usdValue)
      ? total + b.usdValue
      : total;
  }, 0);

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
                  Total: <span className="font-semibold">${formatUsd(totalUsd) || '—'} USD</span>
                  <span className="opacity-60"> · {balances.length} chains</span>
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onRefresh}
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
              const sev = bal.severity || 'unknown';
              const display = SEVERITY_DISPLAY[sev] || SEVERITY_DISPLAY.unknown;
              const badgeClass = darkMode ? display.dark : display.light;
              const address = bal.walletAddress || bal.address || null;
              const usdValue = typeof bal.usdValue === 'number' && Number.isFinite(bal.usdValue) ? bal.usdValue : null;
              const sweepsRemaining = bal.estimatedSweepsRemaining;

              return (
                <div
                  key={bal.chainId}
                  className={`p-4 border rounded-lg ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  {/* Network name + severity badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {bal.network || bal.name}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
                      title={bal.error || `severity: ${sev}`}
                    >
                      {display.label}
                    </span>
                  </div>

                  {/* Balance */}
                  <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {formatNative(bal.balance)} {bal.symbol}
                  </div>

                  {/* USD value */}
                  {usdValue !== null ? (
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ≈ ${formatUsd(usdValue)} USD
                    </div>
                  ) : (
                    <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      USD: —
                    </div>
                  )}

                  {/* Sweeps remaining estimate */}
                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {sweepsRemaining != null
                      ? `≈ ${sweepsRemaining} sweep${sweepsRemaining === 1 ? '' : 's'} remaining`
                      : 'Sweeps remaining: —'}
                    {bal.avgGasSource === 'fallback' && sweepsRemaining != null && (
                      <span className="opacity-60" title="No historical sweep data on this chain yet — using estimate from configured threshold.">
                        {' '}(estimate)
                      </span>
                    )}
                  </div>

                  {/* Wallet address */}
                  {address ? (
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {address.substring(0, 6)}…{address.substring(address.length - 4)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(address)}
                        className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}
                        title="Copy wallet address"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Address unavailable
                    </div>
                  )}

                  {/* RPC error surfacing — only render when present */}
                  {bal.error && (
                    <div className={`text-xs mt-2 px-2 py-1 rounded ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
                      {bal.error}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {copySuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          Copied to clipboard!
        </div>
      )}
    </>
  );
};

export default SweeperBalances;
