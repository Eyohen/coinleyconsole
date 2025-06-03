// // src/pages/Transactions.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Filter, 
//   Eye, 
//   Copy, 
//   RefreshCw,
//   Calendar,
//   ChevronDown,
//   ExternalLink,
//   X
// } from 'lucide-react';
// import { HiOutlineCurrencyDollar } from "react-icons/hi2";
// import axios from 'axios';
// import { URL } from '../url';
// import { useAuth } from '../context/AuthContext';

// const Transactions = () => {
//   const { user } = useAuth();
  
//   // State for transactions data
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [limit] = useState(5);
  
//   // Filter state
//   const [filters, setFilters] = useState({
//     search: '',
//     status: '',
//     currency: '',
//     startDate: '',
//     endDate: ''
//   });
  
//   // Filter options
//   const [filterOptions, setFilterOptions] = useState({
//     currencies: [],
//     statuses: []
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
//     return parseFloat(amount).toFixed(2);
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
  
//   // Fetch transactions data
//   const fetchTransactions = async (page = 1) => {
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
      
//       const response = await axios.get(`${URL}/api/payments/merchant/list?${params}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//           'x-api-key': user?.apiKey || '',
//           'x-api-secret': user?.apiSecret || ''
//         }
//       });
      
//       if (response.data && response.data.success) {
//         setTransactions(response.data.payments.data);
//         setTotalPages(response.data.payments.totalPages);
//         setTotalCount(response.data.payments.totalCount);
//         setCurrentPage(response.data.payments.currentPage);
        
//         // Set filter options
//         if (response.data.filters) {
//           setFilterOptions({
//             currencies: response.data.filters.currencies || [],
//             statuses: response.data.filters.statuses || []
//           });
//         }
//       } else {
//         setError('Failed to load transactions. Please try again.');
//       }
//     } catch (err) {
//       console.error('Error fetching transactions:', err);
//       setError('Error fetching transactions. Please check your connection and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Handle refresh
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchTransactions(currentPage);
//     setRefreshing(false);
//   };
  
//   // Handle page change
//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     fetchTransactions(page);
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
//     fetchTransactions(1);
//   };
  
//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       search: '',
//       status: '',
//       currency: '',
//       startDate: '',
//       endDate: ''
//     });
//     setCurrentPage(1);
//     fetchTransactions(1);
//   };
  
//   // Get transaction status class
//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'completed':
//         return 'bg-green-100 text-green-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'failed':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };
  
//   // Get blockchain explorer URL
//   const getExplorerUrl = (txHash, currency) => {
//     if (!txHash) return '#';
    
//     // Select appropriate explorer based on currency
//     if (currency === 'SOL' || currency === 'USDC_SOL') {
//       return `https://explorer.solana.com/tx/${txHash}`;
//     } else {
//       // Default to Ethereum explorer for EVM chains
//       return `https://etherscan.io/tx/${txHash}`;
//     }
//   };
  
//   // Format transaction hash for display
//   const formatTxHash = (hash) => {
//     if (!hash) return '-';
//     return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
//   };
  
//   // Load data on mount
//   useEffect(() => {
//     if (user && user.apiKey && user.apiSecret) {
//       fetchTransactions();
//     } else {
//       setLoading(false);
//       setError('Missing API credentials. Please check your account settings.');
//     }
//   }, [user]);
  
//   return (
//     <>
//       {/* Description */}
//       <div className='px-6 py-8 rounded-2xl shadow-lg w-full border mb-8 bg-white'>
//         <div className='flex gap-x-4 items-center'>
//           <HiOutlineCurrencyDollar size={25} className="text-[#7042D2]"/>
//           <p className='font-bold text-3xl'>Transactions</p>
//         </div>
//         <p className='text-lg text-gray-600 pt-2'>View and manage all your cryptocurrency transactions.</p>
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
      
//       {/* Transactions Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//         <div className="flex items-center gap-3">
//           <div className="relative flex-1 min-w-64">
//             <input
//               type="text"
//               name="search"
//               value={filters.search}
//               onChange={handleFilterChange}
//               placeholder="Search by ID or Tx Hash..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2]"
//               onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
//             />
//             <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//           </div>
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
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               name="status"
//               value={filters.status}
//               onChange={handleFilterChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2]"
//             >
//               <option value="">All Statuses</option>
//               {filterOptions.statuses.map(status => (
//                 <option key={status} value={status}>
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
//             <select
//               name="currency"
//               value={filters.currency}
//               onChange={handleFilterChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2]"
//             >
//               <option value="">All Currencies</option>
//               {filterOptions.currencies.map(currency => (
//                 <option key={currency} value={currency}>{currency}</option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//             <input
//               type="date"
//               name="startDate"
//               value={filters.startDate}
//               onChange={handleFilterChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2]"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//             <input
//               type="date"
//               name="endDate"
//               value={filters.endDate}
//               onChange={handleFilterChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2]"
//             />
//           </div>
          
//           <div className="md:col-span-4 flex justify-end gap-2">
//             <button 
//               onClick={resetFilters}
//               className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
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
      
//       {/* Transactions List */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center items-center py-16">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
//           </div>
//         ) : transactions.length === 0 ? (
//           <div className="text-center py-16 text-gray-500">
//             <HiOutlineCurrencyDollar size={48} className="mx-auto text-gray-300 mb-3" />
//             <p className="text-lg">No transactions found</p>
//             <p className="mt-2">Try adjusting your filters or create a new payment</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
//                   <th className="px-6 py-3 font-medium">ID</th>
//                   <th className="px-6 py-3 font-medium">Amount</th>
//                   <th className="px-6 py-3 font-medium">Currency</th>
//                   <th className="px-6 py-3 font-medium">Status</th>
//                   <th className="px-6 py-3 font-medium">Date</th>
//                   <th className="px-6 py-3 font-medium">Tx Hash</th>
//                   <th className="px-6 py-3 font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.map(tx => (
//                   <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="px-6 py-4 font-medium">
//                       {tx.id.substring(0, 8)}...
//                     </td>
//                     <td className="px-6 py-4">
//                       ${formatAmount(tx.amount)}
//                     </td>
//                     <td className="px-6 py-4">
//                       {tx.currency}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(tx.status)}`}>
//                         {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-gray-500">
//                       {formatDate(tx.createdAt)}
//                     </td>
//                     <td className="px-6 py-4 font-mono text-xs">
//                       {formatTxHash(tx.transactionHash)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex space-x-2">
//                         {tx.transactionHash && (
//                           <>
//                             <button
//                               onClick={() => copyToClipboard(tx.transactionHash)}
//                               className="text-gray-400 hover:text-gray-600"
//                               title="Copy transaction hash"
//                             >
//                               <Copy size={16} />
//                             </button>
//                             <a
//                               href={getExplorerUrl(tx.transactionHash, tx.currency)}
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
//         {transactions.length > 0 && (
//           <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
//             <div className="text-sm text-gray-500">
//               Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalCount)} of {totalCount} transactions
//             </div>
//             <div className="flex items-center gap-2">
//               <button 
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>
              
//               {/* Page numbers */}
//               {[...Array(Math.min(5, totalPages))].map((_, index) => {
//                 let pageNumber;
                
//                 // Handle pagination display logic
//                 if (totalPages <= 5) {
//                   pageNumber = index + 1;
//                 } else if (currentPage <= 3) {
//                   pageNumber = index + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNumber = totalPages - 4 + index;
//                 } else {
//                   pageNumber = currentPage - 2 + index;
//                 }
                
//                 // Only render if page number is valid
//                 if (pageNumber > 0 && pageNumber <= totalPages) {
//                   return (
//                     <button
//                       key={pageNumber}
//                       onClick={() => handlePageChange(pageNumber)}
//                       className={`px-3 py-1 rounded-md text-sm ${
//                         pageNumber === currentPage
//                           ? 'bg-[#7042D2] text-white'
//                           : 'border border-gray-300 hover:bg-gray-50'
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
//                 className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Transactions;



// src/pages/Transactions.jsx - Updated for Admin
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Copy, 
  RefreshCw,
  Calendar,
  ChevronDown,
  ExternalLink,
  X,
  Activity
} from 'lucide-react';
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import axios from 'axios';
import { URL } from '../url';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

const Transactions = () => {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  
  // State for transactions data
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    currency: '',
    network: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    currencies: ['USDT', 'USDC', 'DAI', 'BUSD'],
    networks: ['ethereum', 'bsc', 'tron', 'solana', 'algorand'],
    statuses: ['pending', 'completed', 'failed']
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
  
  // Fetch transactions data
  const fetchTransactions = async (page = 1) => {
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
      
      const response = await axios.get(`${URL}/api/admin/transactions?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.data && response.data.success) {
        setTransactions(response.data.data.transactions);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalCount(response.data.data.pagination.totalCount);
        setCurrentPage(response.data.data.pagination.currentPage);
      } else {
        setError('Failed to load transactions. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Error fetching transactions. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions(currentPage);
    setRefreshing(false);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchTransactions(page);
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
    fetchTransactions(1);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      currency: '',
      network: '',
      startDate: '',
      endDate: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
    setCurrentPage(1);
    fetchTransactions(1);
  };
  
  // Get transaction status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get blockchain explorer URL
  const getExplorerUrl = (txHash, network) => {
    if (!txHash) return '#';
    
    // Select appropriate explorer based on network
    if (network?.shortName === 'solana') {
      return `https://explorer.solana.com/tx/${txHash}`;
    } else if (network?.shortName === 'bsc') {
      return `https://bscscan.com/tx/${txHash}`;
    } else if (network?.shortName === 'tron') {
      return `https://tronscan.org/#/transaction/${txHash}`;
    } else {
      // Default to Ethereum explorer
      return `https://etherscan.io/tx/${txHash}`;
    }
  };
  
  // Format transaction hash for display
  const formatTxHash = (hash) => {
    if (!hash) return '-';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
  };
  
  // Load data on mount
  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else {
      setLoading(false);
      setError('Please log in to access transaction data.');
    }
  }, [user]);
  
  return (
    <>
      {/* Page Header */}
      <div className='px-6 py-8 w-full mb-8 flex justify-between'>
        <div>
          <div className='flex gap-x-4 items-center'>
            <Activity size={25} className="text-[#7042D2]"/>
            <p className={`font-bold text-3xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              All Transactions
            </p>
          </div>
          <p className={`text-lg pt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Monitor all payment transactions across your platform.
          </p>
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
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-64">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by ID or Tx Hash..."
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#7042D2] ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            />
            <Search className={`absolute left-3 top-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} size={18} />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`p-2 border rounded-md ${
              showFilters 
                ? darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                : darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
          </button>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className={`flex items-center px-4 py-2 border rounded-md ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <div className={`rounded-lg shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
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
              <option value="">All Statuses</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
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
              {filterOptions.currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
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
                <option key={network} value={network}>
                  {network.charAt(0).toUpperCase() + network.slice(1)}
                </option>
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
          
          <div className="flex items-end">
            <div className="flex gap-2 w-full">
              <button 
                onClick={resetFilters}
                className={`px-3 py-2 border rounded-md text-sm flex-1 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Reset
              </button>
              <button 
                onClick={applyFilters}
                className="px-3 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90 text-sm flex-1"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Transactions List */}
      <div className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Activity size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-lg">No transactions found</p>
            <p className="mt-2">Transactions will appear here as payments are processed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left border-b ${
                  darkMode 
                    ? 'text-gray-300 bg-gray-700 border-gray-600' 
                    : 'text-gray-500 bg-gray-50 border-gray-200'
                }`}>
                  <th className="px-6 py-3 font-medium">Transaction ID</th>
                  <th className="px-6 py-3 font-medium">Merchant</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Currency</th>
                  <th className="px-6 py-3 font-medium">Network</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Tx Hash</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className={`border-b ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}>
                    <td className={`px-6 py-4 font-mono text-xs ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {tx.id.substring(0, 8)}...
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {tx.Merchant?.businessName || 'Unknown'}
                    </td>
                    <td className={`px-6 py-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      ${formatAmount(tx.amount)}
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {tx.currency}
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {tx.Network?.name || 'Ethereum'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(tx.status)}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className={`px-6 py-4 font-mono text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatTxHash(tx.transactionHash)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {tx.transactionHash && (
                          <>
                            <button
                              onClick={() => copyToClipboard(tx.transactionHash)}
                              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                              title="Copy transaction hash"
                            >
                              <Copy size={16} />
                            </button>
                            <a
                              href={getExplorerUrl(tx.transactionHash, tx.Network)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#7042D2] hover:text-purple-700"
                              title="View on blockchain explorer"
                            >
                              <ExternalLink size={16} />
                            </a>
                          </>
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
        {transactions.length > 0 && (
          <div className={`px-6 py-4 flex items-center justify-between border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalCount)} of {totalCount} transactions
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
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
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

export default Transactions;