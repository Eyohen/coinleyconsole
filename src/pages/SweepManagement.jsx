// src/pages/SweepManagement.jsx
import React, { useState, useEffect } from 'react';
import { Wallet, X, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { URL } from '../url';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import SweeperBalances from '../components/SweeperBalances';
import FailedSweepsTable from '../components/FailedSweepsTable';

// Bulk Retry Confirmation Modal
const BulkRetryModal = ({ isOpen, onClose, onConfirm, selectedCount, retrying }) => {
  const { darkMode } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Confirm Bulk Retry
          </h2>
          <button
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X size={24} />
          </button>
        </div>

        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Are you sure you want to retry {selectedCount} failed sweep{selectedCount > 1 ? 's' : ''}?
          This will attempt to process them again.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={retrying}
            className={`px-4 py-2 border rounded-md ${
              darkMode
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={retrying}
            className={`px-4 py-2 rounded-md ${
              retrying
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-[#7042D2] text-white hover:bg-opacity-90'
            }`}
          >
            {retrying ? 'Retrying...' : 'Confirm Retry'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SweepManagement = () => {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();

  // Data states
  const [balances, setBalances] = useState([]);
  const [failedSweeps, setFailedSweeps] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(20);

  // Filter states
  const [networkFilter, setNetworkFilter] = useState('');

  // UI states
  const [loading, setLoading] = useState(true);
  const [balancesLoading, setBalancesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Bulk action states
  const [selectedSweeps, setSelectedSweeps] = useState([]);
  const [bulkRetryModalOpen, setBulkRetryModalOpen] = useState(false);

  // Fetch failed sweeps with pagination and filtering
  const fetchFailedSweeps = async (page = 1, network = '') => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(network && { network })
      });

      const response = await axios.get(`${URL}/api/admin/sweep/failed?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });

      if (response.data?.success) {
        // Backend sends "payments" not "sweeps", transform field names
        const rawPayments = response.data.data?.payments || [];

        const transformedSweeps = rawPayments.map(payment => ({
          paymentId: payment.id,
          merchantName: payment.merchant,
          amount: payment.amount,
          currency: payment.currency,
          network: payment.network,
          error: payment.lastSweepError || 'Unknown error',
          depositAddress: payment.depositAddress,
          failedAt: payment.sweepFailedAt || payment.updatedAt,
          createdAt: payment.createdAt
        }));

        setFailedSweeps(transformedSweeps);
        setTotalPages(response.data.data?.pagination?.totalPages || 1);
        setTotalCount(response.data.data?.pagination?.totalCount || 0);
        setCurrentPage(response.data.data?.pagination?.currentPage || 1);
      }
    } catch (err) {
      console.error('Error fetching failed sweeps:', err);
      setError(err.response?.status === 401
        ? 'Authentication failed. Please log in again.'
        : 'Failed to load failed sweeps.');
      // Set empty array on error to prevent undefined issues
      setFailedSweeps([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sweeper wallet balances
  const fetchBalances = async () => {
    setBalancesLoading(true);

    try {
      const response = await axios.get(`${URL}/api/admin/sweep/balances`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });

      if (response.data?.success) {
        // Backend sends balances directly, not nested in data
        const rawBalances = response.data.balances || [];

        // Transform to match component expectations
        const transformedBalances = rawBalances.map(bal => ({
          network: bal.name,
          balance: bal.balance,
          walletAddress: bal.address || 'Not configured',
          symbol: bal.symbol
        }));

        setBalances(transformedBalances);
      }
    } catch (err) {
      console.error('Error fetching balances:', err);
      // Set empty array on error to prevent undefined issues
      setBalances([]);
    } finally {
      setBalancesLoading(false);
    }
  };

  // Retry single sweep
  const handleRetrySingle = async (paymentId) => {
    setRetrying(true);
    setError(null);

    try {
      const response = await axios.post(`${URL}/api/admin/sweep/${paymentId}/retry`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });

      if (response.data?.success) {
        setSuccessMessage('Sweep retry initiated successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
        await fetchFailedSweeps(currentPage, networkFilter);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to retry sweep');
      setTimeout(() => setError(null), 5000);
    } finally {
      setRetrying(false);
    }
  };

  // Bulk retry selected sweeps
  const handleBulkRetry = async () => {
    if (selectedSweeps.length === 0) return;

    setRetrying(true);
    setError(null);

    try {
      const response = await axios.post(`${URL}/api/admin/sweep/bulk-retry`,
        { paymentIds: selectedSweeps },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      );

      if (response.data?.success) {
        setSuccessMessage(`Successfully retried ${selectedSweeps.length} sweeps!`);
        setTimeout(() => setSuccessMessage(''), 5000);
        setSelectedSweeps([]);
        setBulkRetryModalOpen(false);
        await fetchFailedSweeps(currentPage, networkFilter);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to retry sweeps');
      setTimeout(() => setError(null), 5000);
    } finally {
      setRetrying(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchFailedSweeps(page, networkFilter);
  };

  // Handle network filter change
  const handleNetworkFilterChange = (network) => {
    setNetworkFilter(network);
    fetchFailedSweeps(1, network);
  };

  // Handle select sweep
  const handleSelectSweep = (paymentId) => {
    setSelectedSweeps(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  // Handle select all
  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      setSelectedSweeps(failedSweeps.map(sweep => sweep.paymentId));
    } else {
      setSelectedSweeps([]);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchFailedSweeps(currentPage, networkFilter),
      fetchBalances()
    ]);
    setRefreshing(false);
  };

  // Load data on mount
  useEffect(() => {
    fetchFailedSweeps();
    fetchBalances();
  }, []);

  return (
    <>
      {/* Page Header */}
      <div className="px-6 py-8 w-full mb-8">
        <div className="flex gap-x-4 items-center">
          <Wallet size={25} className="text-[#7042D2]" />
          <p className="font-bold text-3xl">Sweep Management</p>
        </div>
        <p className={`text-lg pt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Monitor sweeper wallet balances and manage failed deposit sweeps
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 bg-red-50 text-red-700 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-8 bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="mr-2" size={20} />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-green-700 hover:text-green-900">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Sweeper Balances Component */}
      <SweeperBalances
        balances={balances}
        loading={balancesLoading}
        onRefresh={fetchBalances}
      />

      {/* Failed Sweeps Table Component */}
      <FailedSweepsTable
        sweeps={failedSweeps}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        limit={limit}
        networkFilter={networkFilter}
        selectedSweeps={selectedSweeps}
        retrying={retrying}
        onPageChange={handlePageChange}
        onNetworkFilterChange={handleNetworkFilterChange}
        onSelectSweep={handleSelectSweep}
        onSelectAll={handleSelectAll}
        onRetrySingle={handleRetrySingle}
        onBulkRetry={() => setBulkRetryModalOpen(true)}
      />

      {/* Bulk Retry Confirmation Modal */}
      <BulkRetryModal
        isOpen={bulkRetryModalOpen}
        onClose={() => setBulkRetryModalOpen(false)}
        onConfirm={handleBulkRetry}
        selectedCount={selectedSweeps.length}
        retrying={retrying}
      />
    </>
  );
};

export default SweepManagement;
