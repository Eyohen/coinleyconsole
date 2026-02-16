// src/components/FailedSweepsTable.jsx
import React, { useState } from 'react';
import { CheckCircle, Copy, RotateCcw } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';

const FailedSweepsTable = ({
  sweeps = [],
  loading = false,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  limit = 20,
  networkFilter = '',
  selectedSweeps = [],
  retrying = false,
  onPageChange,
  onNetworkFilterChange,
  onSelectSweep,
  onSelectAll,
  onRetrySingle,
  onBulkRetry
}) => {
  const { darkMode } = useDarkMode();
  const [copySuccess, setCopySuccess] = useState('');

  const networks = ['Optimism', 'BSC', 'Polygon', 'Base', 'Arbitrum', 'Avalanche', 'Monad'];

  const isAllSelected = sweeps?.length > 0 &&
    sweeps.every(s => selectedSweeps.includes(s.paymentId));

  const handleSelectAll = (e) => {
    onSelectAll(e.target.checked);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(text);
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <>
      <div className={`rounded-lg shadow-sm p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Failed Sweeps
          </h2>

          {/* Bulk actions bar */}
          {selectedSweeps.length > 0 && (
            <div className="flex items-center gap-3">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedSweeps.length} selected
              </span>
              <button
                onClick={onBulkRetry}
                disabled={retrying}
                className={`px-4 py-2 rounded-md font-medium ${
                  retrying
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-[#7042D2] text-white hover:bg-opacity-90'
                }`}
              >
                {retrying ? 'Retrying...' : `Retry Selected (${selectedSweeps.length})`}
              </button>
            </div>
          )}
        </div>

        {/* Filter by network */}
        <div className="mb-4">
          <select
            value={networkFilter}
            onChange={(e) => onNetworkFilterChange(e.target.value)}
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="">All Networks</option>
            {networks.map(net => (
              <option key={net} value={net.toLowerCase()}>{net}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]" />
          </div>
        ) : !sweeps || sweeps.length === 0 ? (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
            <p className="text-lg">No failed sweeps</p>
            <p className="text-sm mt-2">All sweeps are processing successfully!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left border-b ${
                  darkMode ? 'text-gray-300 bg-gray-700 border-gray-600' : 'text-gray-500 bg-gray-50 border-gray-200'
                }`}>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 font-medium">Payment ID</th>
                  <th className="px-6 py-3 font-medium">Merchant</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Network</th>
                  <th className="px-6 py-3 font-medium">Error</th>
                  <th className="px-6 py-3 font-medium">Failed At</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sweeps.map(sweep => (
                  <tr
                    key={sweep.paymentId}
                    className={`border-b ${
                      darkMode
                        ? 'border-gray-700 hover:bg-gray-700'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSweeps.includes(sweep.paymentId)}
                        onChange={() => onSelectSweep(sweep.paymentId)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {sweep.paymentId.substring(0, 12)}...
                        </span>
                        <button
                          onClick={() => copyToClipboard(sweep.paymentId)}
                          className={`${
                            darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title="Copy payment ID"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {sweep.merchantName}
                    </td>
                    <td className={`px-6 py-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {sweep.amount} {sweep.currency}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {sweep.network}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-red-600 text-xs max-w-xs truncate" title={sweep.error}>
                      {sweep.error}
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(sweep.failedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onRetrySingle(sweep.paymentId)}
                        disabled={retrying}
                        className={`flex items-center justify-center px-3 py-1 rounded ${
                          retrying
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#7042D2] text-white hover:bg-opacity-90'
                        }`}
                        title="Retry this sweep"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {sweeps && sweeps.length > 0 && (
          <div className={`px-6 py-4 flex items-center justify-between border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalCount)} of {totalCount} failed sweeps
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>

              {/* Page number display */}
              <span className={`px-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Copy toast */}
      {copySuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          Copied to clipboard!
        </div>
      )}
    </>
  );
};

export default FailedSweepsTable;
