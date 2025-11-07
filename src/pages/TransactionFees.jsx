// // src/pages/TransactionFees.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   DollarSign,
//   Search, 
//   Filter, 
//   Eye, 
//   Copy, 
//   RefreshCw,
//   Calendar,
//   ChevronDown,
//   ExternalLink,
//   X,
//   Wallet,
//   Plus,
//   Settings,
//   TrendingUp,
//   TrendingDown
// } from 'lucide-react';
// import { HiOutlineCurrencyDollar } from "react-icons/hi2";
// import axios from 'axios';
// import { URL } from '../url';
// import { useAuth } from '../context/AuthContext';
// import { useDarkMode } from '../context/DarkModeContext';

// // Wallet Management Modal Component
// const WalletModal = ({ isOpen, onClose, onSave, wallets, networks }) => {
//   const { darkMode } = useDarkMode();
//   const [walletData, setWalletData] = useState({
//     mainWallet: '',
//     networkWallets: {}
//   });

//   useEffect(() => {
//     if (wallets) {
//       setWalletData({
//         mainWallet: wallets.mainWallet || '',
//         networkWallets: wallets.networkWallets || {}
//       });
//     }
//   }, [wallets]);

//   const handleNetworkWalletChange = (networkShortName, address) => {
//     setWalletData(prev => ({
//       ...prev,
//       networkWallets: {
//         ...prev.networkWallets,
//         [networkShortName]: address
//       }
//     }));
//   };

//   const handleSave = () => {
//     onSave(walletData);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto`}>
//         <div className="flex items-center justify-between mb-6">
//           <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//             Manage Fee Collection Wallets
//           </h2>
//           <button 
//             onClick={onClose}
//             className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <div className="space-y-6">
//           {/* Main Ethereum Wallet */}
//           <div>
//             <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//               Main Wallet (Ethereum)
//             </label>
//             <input
//               type="text"
//               value={walletData.mainWallet}
//               onChange={(e) => setWalletData(prev => ({ ...prev, mainWallet: e.target.value }))}
//               placeholder="0x..."
//               className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-white border-gray-300 text-gray-800'
//               }`}
//             />
//           </div>

//           {/* Network-specific Wallets */}
//           <div>
//             <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//               Network-Specific Wallets
//             </h3>
//             <div className="space-y-4">
//               {networks?.map(network => (
//                 <div key={network.id} className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2 w-32">
//                     {network.logo && (
//                       <img src={network.logo} alt={network.name} className="w-6 h-6" />
//                     )}
//                     <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                       {network.name}
//                     </span>
//                   </div>
//                   <input
//                     type="text"
//                     value={walletData.networkWallets[network.shortName] || ''}
//                     onChange={(e) => handleNetworkWalletChange(network.shortName, e.target.value)}
//                     placeholder={`Enter ${network.name} wallet address...`}
//                     className={`flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${
//                       darkMode 
//                         ? 'bg-gray-700 border-gray-600 text-white' 
//                         : 'bg-white border-gray-300 text-gray-800'
//                     }`}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end space-x-3 mt-6">
//           <button
//             onClick={onClose}
//             className={`px-4 py-2 border rounded-md ${
//               darkMode 
//                 ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
//                 : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90"
//           >
//             Save Wallets
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TransactionFees = () => {
//   const { user } = useAuth();
//   const { darkMode } = useDarkMode();
  
//   // State for fee transactions data
//   const [feeTransactions, setFeeTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // State for statistics
//   const [statistics, setStatistics] = useState({
//     totalFeeRevenue: 0,
//     thisMonthFees: 0,
//     transactionCount: 0,
//     avgFeePerTransaction: 0
//   });

//   // State for wallets
//   const [wallets, setWallets] = useState({
//     mainWallet: '',
//     networkWallets: {}
//   });
//   const [networks, setNetworks] = useState([]);
//   const [showWalletModal, setShowWalletModal] = useState(false);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [limit] = useState(10);
  
//   // Filter state
//   const [filters, setFilters] = useState({
//     currency: '',
//     network: '',
//     startDate: '',
//     endDate: ''
//   });
  
//   // Filter options
//   const [filterOptions, setFilterOptions] = useState({
//     currencies: [],
//     networks: []
//   });
  
//   // UI state
//   const [showFilters, setShowFilters] = useState(false);
//   const [copySuccess, setCopySuccess] = useState('');
//   const [refreshing, setRefreshing] = useState(false);
  
//   // Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };
  
//   // Format currency amount
//   const formatAmount = (amount) => {
//     return parseFloat(amount).toFixed(6);
//   };
  
//   // Copy to clipboard
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text)
//       .then(() => {
//         setCopySuccess(text);
//         setTimeout(() => setCopySuccess(''), 2000);
//       })
//       .catch(err => {
//         console.error('Failed to copy text: ', err);
//       });
//   };
  
//   // Fetch fee transactions data
//   const fetchFeeTransactions = async (page = 1) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Build query parameters
//       const params = new URLSearchParams({
//         page,
//         limit,
//         ...Object.fromEntries(
//           Object.entries(filters).filter(([_, value]) => value !== '')
//         )
//       });
      
//       const response = await axios.get(`${URL}/api/admin/fee-transactions?${params}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`
//         }
//       });
      
//       if (response.data && response.data.success) {
//         setFeeTransactions(response.data.data.feeTransactions);
//         setTotalPages(response.data.data.pagination.totalPages);
//         setTotalCount(response.data.data.pagination.totalCount);
//         setCurrentPage(response.data.data.pagination.currentPage);
        
//         // Update statistics
//         setStatistics(prev => ({
//           ...prev,
//           totalFeeRevenue: response.data.data.totalFeeRevenue,
//           transactionCount: response.data.data.pagination.totalCount
//         }));
//       } else {
//         setError('Failed to load fee transactions. Please try again.');
//       }
//     } catch (err) {
//       console.error('Error fetching fee transactions:', err);
//       setError('Error fetching fee transactions. Please check your connection and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch admin wallets
//   const fetchAdminWallets = async () => {
//     try {
//       const response = await axios.get(`${URL}/api/admin/wallets`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`
//         }
//       });
      
//       if (response.data && response.data.success) {
//         setWallets({
//           mainWallet: response.data.data.mainWallet || '',
//           networkWallets: response.data.data.networkWallets || {}
//         });
//         setNetworks(response.data.data.availableNetworks || []);
//       }
//     } catch (err) {
//       console.error('Error fetching admin wallets:', err);
//     }
//   };

//   // Fetch networks for filter options
//   const fetchNetworks = async () => {
//     try {
//       const response = await axios.get(`${URL}/api/networks`);
//       if (response.data && response.data.networks) {
//         const networkOptions = response.data.networks.map(network => ({
//           value: network.shortName,
//           label: network.name
//         }));
//         setFilterOptions(prev => ({
//           ...prev,
//           networks: networkOptions
//         }));
//       }
//     } catch (err) {
//       console.error('Error fetching networks:', err);
//     }
//   };
  
//   // Handle refresh
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([
//       fetchFeeTransactions(currentPage),
//       fetchAdminWallets()
//     ]);
//     setRefreshing(false);
//   };
  
//   // Handle page change
//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     fetchFeeTransactions(page);
//   };
  
//   // Handle filter change
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
  
//   // Apply filters
//   const applyFilters = () => {
//     setCurrentPage(1); // Reset to first page
//     fetchFeeTransactions(1);
//   };
  
//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       currency: '',
//       network: '',
//       startDate: '',
//       endDate: ''
//     });
//     setCurrentPage(1);
//     fetchFeeTransactions(1);
//   };

//   // Save wallet addresses
//   const handleSaveWallets = async (walletData) => {
//     try {
//       const response = await axios.put(`${URL}/api/admin/wallets`, {
//         walletAddress: walletData.mainWallet,
//         networkWallets: walletData.networkWallets
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`
//         }
//       });

//       if (response.data && response.data.success) {
//         setWallets(walletData);
//         // You could add a success notification here
//       }
//     } catch (err) {
//       console.error('Error saving wallet addresses:', err);
//       setError('Failed to save wallet addresses. Please try again.');
//     }
//   };
  
//   // Format transaction hash for display
//   const formatTxHash = (hash) => {
//     if (!hash) return '-';
//     return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
//   };
  
//   // Load data on mount
//   useEffect(() => {
//     Promise.all([
//       fetchFeeTransactions(),
//       fetchAdminWallets(),
//       fetchNetworks()
//     ]);
//   }, []);

//   // Calculate additional statistics
//   useEffect(() => {
//     if (feeTransactions.length > 0) {
//       const avgFee = statistics.totalFeeRevenue / statistics.transactionCount;
//       setStatistics(prev => ({
//         ...prev,
//         avgFeePerTransaction: avgFee
//       }));
//     }
//   }, [feeTransactions, statistics.totalFeeRevenue, statistics.transactionCount]);
  
//   return (
//     <>
//       {/* Page Header */}
//       <div className='px-6 py-8 w-full mb-8 flex justify-between'>
//         <div>
//           <div className='flex gap-x-4 items-center'>
//             <DollarSign size={25} className="text-[#7042D2]"/>
//             <p className='font-bold text-3xl'>Transaction Fees</p>
//           </div>
//           <p className='text-lg text-gray-600 pt-2'>Monitor and manage your platform revenue from transaction fees.</p>
//         </div>
//         <div>
//           <button 
//             onClick={() => setShowWalletModal(true)}
//             className='bg-[#7042D2] text-white px-4 py-2 rounded-lg flex gap-x-2 items-center'
//           >
//             <Wallet size={18}/> 
//             Manage Wallets
//           </button>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-green-100">
//               <DollarSign size={20} className="text-green-600" />
//             </div>
//             <h3 className="ml-3 text-sm font-medium text-gray-500">Total Fee Revenue</h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className="text-2xl font-bold">${formatAmount(statistics.totalFeeRevenue)}</span>
//             <span className="text-sm flex items-center text-green-500">
//               <TrendingUp size={14} className="mr-1" />
//               +12.5%
//             </span>
//           </div>
//         </div>
        
//         <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-blue-100">
//               <HiOutlineCurrencyDollar size={20} className="text-blue-600" />
//             </div>
//             <h3 className="ml-3 text-sm font-medium text-gray-500">Total Transactions</h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className="text-2xl font-bold">{statistics.transactionCount}</span>
//             <span className="text-sm flex items-center text-green-500">
//               <TrendingUp size={14} className="mr-1" />
//               +8.2%
//             </span>
//           </div>
//         </div>
        
//         <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-purple-100">
//               <TrendingUp size={20} className="text-purple-600" />
//             </div>
//             <h3 className="ml-3 text-sm font-medium text-gray-500">Avg Fee per Transaction</h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className="text-2xl font-bold">${formatAmount(statistics.avgFeePerTransaction)}</span>
//             <span className="text-sm flex items-center text-gray-500">
//               1.75% fee
//             </span>
//           </div>
//         </div>
        
//         <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-yellow-100">
//               <Wallet size={20} className="text-yellow-600" />
//             </div>
//             <h3 className="ml-3 text-sm font-medium text-gray-500">Active Wallets</h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className="text-2xl font-bold">
//               {(wallets.mainWallet ? 1 : 0) + Object.keys(wallets.networkWallets || {}).length}
//             </span>
//             <span className="text-sm flex items-center text-blue-500">
//               <Settings size={14} className="mr-1" />
//               Configured
//             </span>
//           </div>
//         </div>
//       </div>
      
//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 flex items-center">
//           <span className="flex-grow">{error}</span>
//           <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900">
//             <X size={18} />
//           </button>
//         </div>
//       )}
      
//       {/* Filters and Search */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//         <div className="flex items-center gap-3">
//           <button 
//             onClick={() => setShowFilters(!showFilters)} 
//             className={`p-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 ${showFilters ? 'bg-gray-100' : ''}`}
//           >
//             <Filter size={18} />
//           </button>
//         </div>
//         <button 
//           onClick={handleRefresh}
//           disabled={refreshing || loading}
//           className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//         >
//           <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//           {refreshing ? 'Refreshing...' : 'Refresh'}
//         </button>
//       </div>
      
//       {/* Filters Panel */}
//       {showFilters && (
//         <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4`}>
//           <div>
//             <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//               Currency
//             </label>
//             <select
//               name="currency"
//               value={filters.currency}
//               onChange={handleFilterChange}
//               className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2] ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-white border-gray-300 text-gray-800'
//               }`}
//             >
//               <option value="">All Currencies</option>
//               <option value="USDT">USDT</option>
//               <option value="USDC">USDC</option>
//               <option value="DAI">DAI</option>
//             </select>
//           </div>
          
//           <div>
//             <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//               Network
//             </label>
//             <select
//               name="network"
//               value={filters.network}
//               onChange={handleFilterChange}
//               className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2] ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-white border-gray-300 text-gray-800'
//               }`}
//             >
//               <option value="">All Networks</option>
//               {filterOptions.networks.map(network => (
//                 <option key={network.value} value={network.value}>{network.label}</option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//               From Date
//             </label>
//             <input
//               type="date"
//               name="startDate"
//               value={filters.startDate}
//               onChange={handleFilterChange}
//               className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2] ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-white border-gray-300 text-gray-800'
//               }`}
//             />
//           </div>
          
//           <div>
//             <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//               To Date
//             </label>
//             <input
//               type="date"
//               name="endDate"
//               value={filters.endDate}
//               onChange={handleFilterChange}
//               className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2] ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-white border-gray-300 text-gray-800'
//               }`}
//             />
//           </div>
          
//           <div className="md:col-span-4 flex justify-end gap-2">
//             <button 
//               onClick={resetFilters}
//               className={`px-4 py-2 border rounded-md ${
//                 darkMode 
//                   ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
//                   : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               Reset
//             </button>
//             <button 
//               onClick={applyFilters}
//               className="px-4 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90"
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       )}
      
//       {/* Fee Transactions List */}
//       <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
//         {loading ? (
//           <div className="flex justify-center items-center py-16">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
//           </div>
//         ) : feeTransactions.length === 0 ? (
//           <div className="text-center py-16 text-gray-500">
//             <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
//             <p className="text-lg">No fee transactions found</p>
//             <p className="mt-2">Fee transactions will appear here as payments are processed</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className={`text-left ${darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-50'} border-b border-gray-200`}>
//                   <th className="px-6 py-3 font-medium">Merchant</th>
//                   <th className="px-6 py-3 font-medium">Original Amount</th>
//                   <th className="px-6 py-3 font-medium">Fee Amount</th>
//                   <th className="px-6 py-3 font-medium">Currency</th>
//                   <th className="px-6 py-3 font-medium">Network</th>
//                   <th className="px-6 py-3 font-medium">Status</th>
//                   <th className="px-6 py-3 font-medium">Date</th>
//                   <th className="px-6 py-3 font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {feeTransactions.map(fee => (
//                   <tr key={fee.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}>
//                     <td className="px-6 py-4 font-medium">
//                       {fee.Merchant?.businessName || 'Unknown'}
//                     </td>
//                     <td className="px-6 py-4">
//                       ${formatAmount(fee.originalAmount)}
//                     </td>
//                     <td className="px-6 py-4 font-semibold text-green-600">
//                       ${formatAmount(fee.amount)}
//                     </td>
//                     <td className="px-6 py-4">
//                       {fee.Payment?.currency || fee.Token?.symbol || 'USDT'}
//                     </td>
//                     <td className="px-6 py-4">
//                       {fee.Network?.name || 'Ethereum'}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         fee.status === 'completed' 
//                           ? 'bg-green-100 text-green-800' 
//                           : fee.status === 'pending' 
//                             ? 'bg-yellow-100 text-yellow-800' 
//                             : 'bg-red-100 text-red-800'
//                       }`}>
//                         {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className={`px-6 py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                       {formatDate(fee.createdAt)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex space-x-2">
//                         {fee.txHash && (
//                           <>
//                             <button
//                               onClick={() => copyToClipboard(fee.txHash)}
//                               className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
//                               title="Copy transaction hash"
//                             >
//                               <Copy size={16} />
//                             </button>
//                             <a
//                               href={`https://etherscan.io/tx/${fee.txHash}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-[#7042D2] hover:text-purple-700"
//                               title="View on blockchain explorer"
//                             >
//                               <ExternalLink size={16} />
//                             </a>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
        
//         {/* Pagination */}
//         {feeTransactions.length > 0 && (
//           <div className={`px-6 py-4 flex items-center justify-between border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//             <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//               Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalCount)} of {totalCount} fee transactions
//             </div>
//             <div className="flex items-center gap-2">
//               <button 
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
//                   darkMode 
//                     ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
//                     : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                 }`}
//               >
//                 Previous
//               </button>
              
//               {/* Page numbers */}
//               {[...Array(Math.min(5, totalPages))].map((_, index) => {
//                 let pageNumber;
                
//                 if (totalPages <= 5) {
//                   pageNumber = index + 1;
//                 } else if (currentPage <= 3) {
//                   pageNumber = index + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNumber = totalPages - 4 + index;
//                 } else {
//                   pageNumber = currentPage - 2 + index;
//                 }
                
//                 if (pageNumber > 0 && pageNumber <= totalPages) {
//                   return (
//                     <button
//                       key={pageNumber}
//                       onClick={() => handlePageChange(pageNumber)}
//                       className={`px-3 py-1 rounded-md text-sm ${
//                         pageNumber === currentPage
//                           ? 'bg-[#7042D2] text-white'
//                           : darkMode
//                             ? 'border border-gray-600 text-gray-300 hover:bg-gray-700'
//                             : 'border border-gray-300 hover:bg-gray-50'
//                       }`}
//                     >
//                       {pageNumber}
//                     </button>
//                   );
//                 }
//                 return null;
//               })}
              
//               <button 
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
//                   darkMode 
//                     ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
//                     : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Wallet Management Modal */}
//       <WalletModal
//         isOpen={showWalletModal}
//         onClose={() => setShowWalletModal(false)}
//         onSave={handleSaveWallets}
//         wallets={wallets}
//         networks={networks}
//       />

//       {/* Copy Success Notification */}
//       {copySuccess && (
//         <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md">
//           Copied to clipboard!
//         </div>
//       )}
//     </>
//   );
// };

// export default TransactionFees;






// src/pages/TransactionFees.jsx - Updated with Fee Processing Integration
import React, { useState, useEffect } from 'react';
import { 
  DollarSign,
  Search, 
  Filter, 
  Eye, 
  Copy, 
  RefreshCw,
  Calendar,
  ChevronDown,
  ExternalLink,
  X,
  Wallet,
  Plus,
  Settings,
  TrendingUp,
  TrendingDown,
  Play,
  RotateCcw,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import axios from 'axios';
import { URL } from '../url';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

// Wallet Management Modal Component
const WalletModal = ({ isOpen, onClose, onSave, wallets, networks }) => {
  const { darkMode } = useDarkMode();
  const [walletData, setWalletData] = useState({
    mainWallet: '',
    networkWallets: {}
  });

  // Define supported networks for the modal
  const supportedNetworks = [
    { id: 'ethereum', name: 'Ethereum', shortName: 'ethereum', logo: null },
    { id: 'bsc', name: 'Binance Smart Chain', shortName: 'bsc', logo: null },
    { id: 'polygon', name: 'Polygon', shortName: 'polygon', logo: null },
    { id: 'arbitrum', name: 'Arbitrum', shortName: 'arbitrum', logo: null },
    { id: 'optimism', name: 'Optimism', shortName: 'optimism', logo: null },
    { id: 'avalanche', name: 'Avalanche', shortName: 'avalanche', logo: null },
    { id: 'celo', name: 'Celo', shortName: 'celo', logo: null },
    { id: 'base', name: 'Base', shortName: 'base', logo: null },
    { id: 'tron', name: 'TRON', shortName: 'tron', logo: null },
    { id: 'solana', name: 'Solana', shortName: 'solana', logo: null },
    { id: 'algorand', name: 'Algorand', shortName: 'algorand', logo: null }
  ];

  // Merge backend networks with supported networks (prioritize backend data)
  const displayNetworks = networks && networks.length > 0 ? networks : supportedNetworks;

  useEffect(() => {
    if (wallets) {
      setWalletData({
        mainWallet: wallets.mainWallet || '',
        networkWallets: wallets.networkWallets || {}
      });
    }
  }, [wallets]);

  const handleNetworkWalletChange = (networkShortName, address) => {
    setWalletData(prev => ({
      ...prev,
      networkWallets: {
        ...prev.networkWallets,
        [networkShortName]: address
      }
    }));
  };

  const handleSave = () => {
    onSave(walletData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Manage Fee Collection Wallets
          </h2>
          <button 
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Main Ethereum Wallet */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Main Wallet (Ethereum)
            </label>
            <input
              type="text"
              value={walletData.mainWallet}
              onChange={(e) => setWalletData(prev => ({ ...prev, mainWallet: e.target.value }))}
              placeholder="0x..."
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
          </div>

          {/* Network-specific Wallets */}
          <div>
            <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Network-Specific Wallets
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Configure wallet addresses for receiving fees on different blockchain networks
            </p>
            <div className="space-y-4">
              {displayNetworks?.map(network => (
                <div key={network.id || network.shortName} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 w-40">
                    {network.logo && (
                      <img src={network.logo} alt={network.name} className="w-6 h-6" />
                    )}
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {network.name}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={walletData.networkWallets[network.shortName] || ''}
                    onChange={(e) => handleNetworkWalletChange(network.shortName, e.target.value)}
                    placeholder={`Enter ${network.name} wallet address...`}
                    className={`flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2] font-mono text-sm ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 border rounded-md ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90"
          >
            Save Wallets
          </button>
        </div>
      </div>
    </div>
  );
};

const TransactionFees = () => {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  
  // State for fee transactions data
  const [feeTransactions, setFeeTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for statistics
  const [statistics, setStatistics] = useState({
    totalFeeRevenue: 0,
    thisMonthFees: 0,
    transactionCount: 0,
    avgFeePerTransaction: 0,
    pendingCount: 0,
    failedCount: 0,
    completedCount: 0
  });

  // State for wallets
  const [wallets, setWallets] = useState({
    mainWallet: '',
    networkWallets: {}
  });
  const [networks, setNetworks] = useState([]);

  // Fee processing states
  const [feeProcessing, setFeeProcessing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);
  
  // Filter state
  const [filters, setFilters] = useState({
    currency: '',
    network: '',
    startDate: '',
    endDate: '',
    status: ''
  });
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    currencies: [],
    networks: []
  });
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format currency amount
  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(6);
  };
  
  // Copy to clipboard
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
  
  // Fetch fee transactions data
  const fetchFeeTransactions = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page,
        limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });
      
      const response = await axios.get(`${URL}/api/admin/fee-transactions?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.data && response.data.success) {
        setFeeTransactions(response.data.data.feeTransactions);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalCount(response.data.data.pagination.totalCount);
        setCurrentPage(response.data.data.pagination.currentPage);
        
        // Calculate status counts
        const pending = response.data.data.feeTransactions.filter(fee => fee.status === 'pending').length;
        const failed = response.data.data.feeTransactions.filter(fee => fee.status === 'failed').length;
        const completed = response.data.data.feeTransactions.filter(fee => fee.status === 'completed').length;
        
        // Update statistics
        setStatistics(prev => ({
          ...prev,
          totalFeeRevenue: response.data.data.totalFeeRevenue,
          transactionCount: response.data.data.pagination.totalCount,
          pendingCount: pending,
          failedCount: failed,
          completedCount: completed
        }));
      } else {
        setError('Failed to load fee transactions. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching fee transactions:', err);
      setError('Error fetching fee transactions. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Process all pending fees
  const processPendingFees = async () => {
    if (feeProcessing) return;
    
    setFeeProcessing(true);
    setError(null);
    
    try {
      const response = await axios.post(`${URL}/api/fees/process-all-pending`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.data && response.data.success) {
        setSuccessMessage(`Successfully processed ${response.data.data.processed} pending fees!`);
        setTimeout(() => setSuccessMessage(''), 5000);
        
        // Refresh fee transactions data
        await fetchFeeTransactions(currentPage);
      } else {
        setError('Failed to process pending fees. Please try again.');
      }
    } catch (err) {
      console.error('Error processing pending fees:', err);
      setError('Error processing pending fees. Please check your connection and try again.');
    } finally {
      setFeeProcessing(false);
    }
  };

  // Retry failed fees
  const retryFailedFees = async () => {
    if (feeProcessing) return;
    
    setFeeProcessing(true);
    setError(null);
    
    try {
      const response = await axios.post(`${URL}/api/fees/retry-failed`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.data && response.data.success) {
        setSuccessMessage(`Successfully retried ${response.data.data.retried} failed fees!`);
        setTimeout(() => setSuccessMessage(''), 5000);
        
        // Refresh fee transactions data
        await fetchFeeTransactions(currentPage);
      } else {
        setError('Failed to retry failed fees. Please try again.');
      }
    } catch (err) {
      console.error('Error retrying failed fees:', err);
      setError('Error retrying failed fees. Please check your connection and try again.');
    } finally {
      setFeeProcessing(false);
    }
  };

  // Process individual fee transaction
  const processIndividualFee = async (feeTransaction) => {
    if (feeProcessing) return;
    
    setFeeProcessing(true);
    setError(null);
    
    try {
      const response = await axios.post(`${URL}/api/fees/process-payment-fee`, {
        paymentId: feeTransaction.paymentId,
        transactionHash: feeTransaction.Payment?.transactionHash
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.data && response.data.success) {
        setSuccessMessage(`Successfully processed fee for payment ${feeTransaction.paymentId}!`);
        setTimeout(() => setSuccessMessage(''), 5000);
        
        // Refresh fee transactions data
        await fetchFeeTransactions(currentPage);
      } else {
        setError(`Failed to process fee: ${response.data.error}`);
      }
    } catch (err) {
      console.error('Error processing individual fee:', err);
      setError('Error processing fee. Please check your connection and try again.');
    } finally {
      setFeeProcessing(false);
    }
  };

  // Fetch admin wallets
  const fetchAdminWallets = async () => {
    try {
      const response = await axios.get(`${URL}/api/admin/wallets`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.data && response.data.success) {
        setWallets({
          mainWallet: response.data.data.mainWallet || '',
          networkWallets: response.data.data.networkWallets || {}
        });
        setNetworks(response.data.data.availableNetworks || []);
      }
    } catch (err) {
      console.error('Error fetching admin wallets:', err);
    }
  };

  // Fetch networks for filter options
  const fetchNetworks = async () => {
    try {
      const response = await axios.get(`${URL}/api/networks`);
      if (response.data && response.data.networks) {
        const networkOptions = response.data.networks.map(network => ({
          value: network.shortName,
          label: network.name
        }));
        setFilterOptions(prev => ({
          ...prev,
          networks: networkOptions
        }));
      }
    } catch (err) {
      console.error('Error fetching networks:', err);
    }
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchFeeTransactions(currentPage),
      fetchAdminWallets()
    ]);
    setRefreshing(false);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchFeeTransactions(page);
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page
    fetchFeeTransactions(1);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      currency: '',
      network: '',
      startDate: '',
      endDate: '',
      status: ''
    });
    setCurrentPage(1);
    fetchFeeTransactions(1);
  };

  // Format transaction hash for display
  const formatTxHash = (hash) => {
    if (!hash) return '-';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
  };
  
  // Load data on mount
  useEffect(() => {
    Promise.all([
      fetchFeeTransactions(),
      fetchAdminWallets(),
      fetchNetworks()
    ]);
  }, []);

  // Calculate additional statistics
  useEffect(() => {
    if (feeTransactions.length > 0) {
      const avgFee = statistics.totalFeeRevenue / statistics.transactionCount;
      setStatistics(prev => ({
        ...prev,
        avgFeePerTransaction: avgFee
      }));
    }
  }, [feeTransactions, statistics.totalFeeRevenue, statistics.transactionCount]);
  
  return (
    <>
      {/* Page Header */}
      <div className='px-6 py-8 w-full mb-8 flex justify-between'>
        <div>
          <div className='flex gap-x-4 items-center'>
            <DollarSign size={25} className="text-[#7042D2]"/>
            <p className='font-bold text-3xl'>Transaction Fees</p>
          </div>
          <p className='text-lg text-gray-600 pt-2'>Monitor and manage your platform revenue from transaction fees.</p>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
            <X size={18} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="mr-2" size={20} />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-green-700 hover:text-green-900">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Fee Processing Controls */}
      {(statistics.pendingCount > 0 || statistics.failedCount > 0) && (
        <div className={`rounded-lg shadow-sm p-6 mb-8 border-l-4 border-yellow-400 ${
          darkMode ? 'bg-yellow-900/20 border-yellow-400' : 'bg-yellow-50 border-yellow-400'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                Fee Processing Required
              </h3>
              <div className={`mt-2 text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                {statistics.pendingCount > 0 && (
                  <p>• {statistics.pendingCount} pending fee(s) need to be processed</p>
                )}
                {statistics.failedCount > 0 && (
                  <p>• {statistics.failedCount} failed fee(s) need to be retried</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {statistics.pendingCount > 0 && (
                <button
                  onClick={processPendingFees}
                  disabled={feeProcessing}
                  className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                    feeProcessing
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-[#7042D2] text-white hover:bg-purple-700'
                  }`}
                >
                  {feeProcessing ? (
                    <RefreshCw className="animate-spin mr-2" size={16} />
                  ) : (
                    <Play className="mr-2" size={16} />
                  )}
                  Process All Pending
                </button>
              )}
              
              {statistics.failedCount > 0 && (
                <button
                  onClick={retryFailedFees}
                  disabled={feeProcessing}
                  className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                    feeProcessing
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {feeProcessing ? (
                    <RefreshCw className="animate-spin mr-2" size={16} />
                  ) : (
                    <RotateCcw className="mr-2" size={16} />
                  )}
                  Retry All Failed
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-green-100">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <h3 className="ml-3 text-sm font-medium text-gray-500">Total Fee Revenue</h3>
          </div>
          <div className="flex items-end mt-2 justify-between">
            <span className="text-2xl font-bold">${formatAmount(statistics.totalFeeRevenue)}</span>
            <span className="text-sm flex items-center text-green-500">
              <TrendingUp size={14} className="mr-1" />
              +12.5%
            </span>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-green-100">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <h3 className="ml-3 text-sm font-medium text-gray-500">Completed</h3>
          </div>
          <div className="flex items-end mt-2 justify-between">
            <span className="text-2xl font-bold">{statistics.completedCount}</span>
            <span className="text-sm text-gray-500">Processed</span>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-yellow-100">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <h3 className="ml-3 text-sm font-medium text-gray-500">Pending</h3>
          </div>
          <div className="flex items-end mt-2 justify-between">
            <span className="text-2xl font-bold">{statistics.pendingCount}</span>
            <span className="text-sm text-yellow-600">Waiting</span>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-red-100">
              <XCircle size={20} className="text-red-600" />
            </div>
            <h3 className="ml-3 text-sm font-medium text-gray-500">Failed</h3>
          </div>
          <div className="flex items-end mt-2 justify-between">
            <span className="text-2xl font-bold">{statistics.failedCount}</span>
            <span className="text-sm text-red-600">Need Retry</span>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-blue-100">
              <Wallet size={20} className="text-blue-600" />
            </div>
            <h3 className="ml-3 text-sm font-medium text-gray-500">Active Wallets</h3>
          </div>
          <div className="flex items-end mt-2 justify-between">
            <span className="text-2xl font-bold">
              {(wallets.mainWallet ? 1 : 0) + Object.keys(wallets.networkWallets || {}).length}
            </span>
            <span className="text-sm flex items-center text-blue-500">
              <Settings size={14} className="mr-1" />
              Configured
            </span>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 flex items-center">
          <span className="flex-grow">{error}</span>
          <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900">
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`p-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 ${showFilters ? 'bg-gray-100' : ''}`}
          >
            <Filter size={18} />
          </button>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4`}>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Currency
            </label>
            <select
              name="currency"
              value={filters.currency}
              onChange={handleFilterChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="">All Currencies</option>
              <option value="USDT">USDT</option>
              <option value="USDC">USDC</option>
              <option value="DAI">DAI</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Network
            </label>
            <select
              name="network"
              value={filters.network}
              onChange={handleFilterChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="">All Networks</option>
              {filterOptions.networks.map(network => (
                <option key={network.value} value={network.value}>{network.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              From Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              To Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
          </div>
          
          <div className="md:col-span-5 flex justify-end gap-2">
            <button 
              onClick={resetFilters}
              className={`px-4 py-2 border rounded-md ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Reset
            </button>
            <button 
              onClick={applyFilters}
              className="px-4 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Fee Transactions List */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
          </div>
        ) : feeTransactions.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-lg">No fee transactions found</p>
            <p className="mt-2">Fee transactions will appear here as payments are processed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left ${darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-50'} border-b border-gray-200`}>
                  <th className="px-6 py-3 font-medium">Merchant</th>
                  <th className="px-6 py-3 font-medium">Original Amount</th>
                  <th className="px-6 py-3 font-medium">Fee Amount</th>
                  <th className="px-6 py-3 font-medium">Currency</th>
                  <th className="px-6 py-3 font-medium">Network</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {feeTransactions.map(fee => (
                  <tr key={fee.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 font-medium">
                      {fee.Merchant?.businessName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      ${formatAmount(fee.originalAmount)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ${formatAmount(fee.amount)}
                    </td>
                    <td className="px-6 py-4">
                      {fee.Payment?.currency || fee.Token?.symbol || 'USDT'}
                    </td>
                    <td className="px-6 py-4">
                      {fee.Network?.name || 'Ethereum'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          fee.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : fee.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {fee.status === 'completed' && <CheckCircle size={12} className="mr-1" />}
                          {fee.status === 'pending' && <Clock size={12} className="mr-1" />}
                          {fee.status === 'failed' && <XCircle size={12} className="mr-1" />}
                          {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(fee.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {/* Process individual fee button for pending/failed */}
                        {(fee.status === 'pending' || fee.status === 'failed') && (
                          <button
                            onClick={() => processIndividualFee(fee)}
                            disabled={feeProcessing}
                            className={`text-sm px-2 py-1 rounded ${
                              feeProcessing
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#7042D2] text-white hover:bg-purple-700'
                            }`}
                            title={fee.status === 'pending' ? 'Process this fee' : 'Retry this fee'}
                          >
                            {fee.status === 'pending' ? (
                              <Play size={12} />
                            ) : (
                              <RotateCcw size={12} />
                            )}
                          </button>
                        )}
                        
                        {/* Copy transaction hash */}
                        {fee.txHash && (
                          <button
                            onClick={() => copyToClipboard(fee.txHash)}
                            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Copy transaction hash"
                          >
                            <Copy size={16} />
                          </button>
                        )}
                        
                        {/* View on explorer */}
                        {fee.txHash && (
                          <a
                            href={`https://etherscan.io/tx/${fee.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#7042D2] hover:text-purple-700"
                            title="View on blockchain explorer"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {feeTransactions.length > 0 && (
          <div className={`px-6 py-4 flex items-center justify-between border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalCount)} of {totalCount} fee transactions
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNumber;
                
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }
                
                if (pageNumber > 0 && pageNumber <= totalPages) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        pageNumber === currentPage
                          ? 'bg-[#7042D2] text-white'
                          : darkMode
                            ? 'border border-gray-600 text-gray-300 hover:bg-gray-700'
                            : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
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

      {/* Copy Success Notification */}
      {copySuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md">
          Copied to clipboard!
        </div>
      )}
    </>
  );
};

export default TransactionFees;