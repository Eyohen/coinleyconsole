// // src/pages/Dashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { URL } from '../url';
// import { useAuth } from '../context/AuthContext';
// import { useDarkMode } from '../context/DarkModeContext';
// import { 
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from 'recharts';
// import { 
//   ArrowUp, 
//   ArrowDown, 
//   RefreshCw,
//   DollarSign,
//   AlertCircle,
//   ExternalLink,
//   Store,
//   Users,
//   ChartColumn,
//   TrendingUp,
//   Activity
// } from 'lucide-react';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const { darkMode } = useDarkMode();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dashboardData, setDashboardData] = useState({
//     merchants: { data: [], count: 0 },
//     statistics: {
//       totalMerchants: 0,
//       totalPayments: 0,
//       completedPayments: 0,
//       pendingPayments: 0,
//       totalRevenue: 0,
//       totalFeeRevenue: 0,
//       conversionRate: 0
//     },
//     feeTransactions: [],
//     monthlyStats: []
//   });
  
//   const [timeframe, setTimeframe] = useState('last7Days');
//   const [refreshing, setRefreshing] = useState(false);

//   // Fetch dashboard data from admin API
//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await axios.get(`${URL}/api/admin/dashboard`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`
//         }
//       });
      
//       if (response.data && response.data.success) {
//         setDashboardData(response.data.data);
//       } else {
//         setError('Failed to load dashboard data. Please try again.');
//       }
//     } catch (err) {
//       console.error('Error fetching dashboard data:', err);
//       if (err.response?.status === 401) {
//         setError('Authentication failed. Please log in again.');
//       } else {
//         setError('Failed to load dashboard data. Please check your connection and try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Refresh data
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchDashboardData();
//     setRefreshing(false);
//   };

//   useEffect(() => {
//     if (user) {
//       fetchDashboardData();
//     } else {
//       setLoading(false);
//       setError('Please log in to access the dashboard.');
//     }
//   }, [user]);
  
//   // Handle timeframe change
//   const handleTimeframeChange = (newTimeframe) => {
//     setTimeframe(newTimeframe);
//     // In a real implementation, you might want to refetch data with different date ranges
//   };
  
//   // Format currency for display
//   const formatCurrency = (amount) => {
//     return parseFloat(amount || 0).toFixed(2);
//   };
  
//   // Generate chart colors
//   const COLORS = ['#7042D2', '#50AF95', '#F6B87E', '#8884d8', '#FF6384', '#36A2EB'];
  
//   // Get chart data based on timeframe
//   const getChartData = () => {
//     if (dashboardData.monthlyStats && dashboardData.monthlyStats.length > 0) {
//       let filteredData = [...dashboardData.monthlyStats];
      
//       // Apply timeframe filter
//       if (timeframe === 'last7Days') {
//         // For demo, just take the most recent data points
//         filteredData = filteredData.slice(-3);
//       } else if (timeframe === 'last30Days') {
//         filteredData = filteredData.slice(-6);
//       }
      
//       return filteredData;
//     }
    
//     return [];
//   };
  
//   // Get status distribution data for pie chart
//   const getStatusData = () => {
//     const { totalPayments, completedPayments, pendingPayments } = dashboardData.statistics;
//     const failedPayments = totalPayments - completedPayments - pendingPayments;
    
//     return [
//       { name: 'Completed', value: completedPayments },
//       { name: 'Pending', value: pendingPayments },
//       { name: 'Failed', value: Math.max(0, failedPayments) }
//     ].filter(item => item.value > 0);
//   };

//   // Calculate percentage changes (mock data for now)
//   const getPercentageChange = (current, previous = 0) => {
//     if (previous === 0) return '+0%';
//     const change = ((current - previous) / previous) * 100;
//     return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
//   };

//   return (
//     <>
//       {/* Welcome message */}
//       <div className={`px-6 py-8 w-full mb-8 ${
//         darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//       }`}>
//         <p className={`font-bold text-3xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>Admin Dashboard</p>
//         <p className={`text-lg pt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//           Welcome back {user?.name}!
//         </p>
//       </div>
      
//       {error && (
//         <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 flex items-center">
//           <AlertCircle className="mr-2" size={20} />
//           <span>{error}</span>
//         </div>
//       )}
      
//       {/* Data Controls */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex space-x-2">
//           <button 
//             onClick={() => handleTimeframeChange('last7Days')}
//             className={`px-3 py-2 rounded-md text-sm font-medium ${
//               timeframe === 'last7Days' 
//                 ? 'bg-[#7042D2] text-white' 
//                 : darkMode
//                   ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//                   : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             Last 7 Days
//           </button>
//           <button 
//             onClick={() => handleTimeframeChange('last30Days')}
//             className={`px-3 py-2 rounded-md text-sm font-medium ${
//               timeframe === 'last30Days' 
//                 ? 'bg-[#7042D2] text-white' 
//                 : darkMode
//                   ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//                   : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             Last 30 Days
//           </button>
//           <button 
//             onClick={() => handleTimeframeChange('last90Days')}
//             className={`px-3 py-2 rounded-md text-sm font-medium ${
//               timeframe === 'last90Days' 
//                 ? 'bg-[#7042D2] text-white' 
//                 : darkMode
//                   ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//                   : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             Last 90 Days
//           </button>
//         </div>
        
//         <button 
//           onClick={handleRefresh}
//           disabled={refreshing || loading}
//           className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
//             darkMode
//               ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//               : 'bg-white text-gray-700 hover:bg-gray-50'
//           }`}
//         >
//           <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
//           <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
//         </button>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Total Merchants */}
//         <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-purple-100">
//               <Store size={20} className="text-[#7042D2]" />
//             </div>
//             <h3 className={`ml-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//               Total Merchants
//             </h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//               {dashboardData.statistics.totalMerchants}
//             </span>
//             <span className="text-sm flex items-center text-green-500">
//               <ArrowUp size={14} className="mr-1" />
//               +12.5%
//             </span>
//           </div>
//         </div>
        
//         {/* Total Transactions */}
//         <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-blue-100">
//               <Activity size={20} className="text-blue-600" />
//             </div>
//             <h3 className={`ml-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//               Total Transactions
//             </h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//               {dashboardData.statistics.totalPayments}
//             </span>
//             <span className="text-sm flex items-center text-green-500">
//               <ArrowUp size={14} className="mr-1" />
//               +8.2%
//             </span>
//           </div>
//         </div>
        
//         {/* Total Platform Revenue */}
//         <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-green-100">
//               <DollarSign size={20} className="text-green-600" />
//             </div>
//             <h3 className={`ml-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//               Platform Revenue
//             </h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//               ${formatCurrency(dashboardData.statistics.totalRevenue)}
//             </span>
//             <span className="text-sm flex items-center text-green-500">
//               <TrendingUp size={14} className="mr-1" />
//               +15.3%
//             </span>
//           </div>
//         </div>
        
//         {/* Fee Revenue */}
//         <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-yellow-100">
//               <ChartColumn size={20} className="text-yellow-600" />
//             </div>
//             <h3 className={`ml-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//               Fee Revenue
//             </h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//               ${formatCurrency(dashboardData.statistics.totalFeeRevenue)}
//             </span>
//             <span className="text-sm flex items-center text-green-500">
//               <ArrowUp size={14} className="mr-1" />
//               +22.7%
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Revenue Chart */}
//         <div className={`rounded-lg shadow-sm p-6 lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//               Monthly Revenue Overview
//             </h2>
//           </div>
          
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7042D2]"></div>
//             </div>
//           ) : dashboardData.monthlyStats && dashboardData.monthlyStats.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={getChartData()}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis 
//                   dataKey="month" 
//                   stroke={darkMode ? '#9CA3AF' : '#6B7280'}
//                 />
//                 <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
//                 <Tooltip 
//                   formatter={(value) => [`${formatCurrency(value)}`, 'Revenue']}
//                   labelFormatter={(label) => `Month: ${label}`}
//                   contentStyle={{
//                     backgroundColor: darkMode ? '#374151' : '#FFFFFF',
//                     border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
//                     borderRadius: '8px',
//                     color: darkMode ? '#FFFFFF' : '#1F2937'
//                   }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   name="Revenue"
//                   stroke="#7042D2"
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                   activeDot={{ r: 6 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="transactions"
//                   name="Transactions"
//                   stroke="#50AF95"
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                   activeDot={{ r: 6 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//               <p>No revenue data available</p>
//               <p className="text-sm mt-2">Data will appear here as transactions are processed</p>
//             </div>
//           )}
//         </div>
        
//         {/* Transaction Status Distribution */}
//         <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//               Transaction Status
//             </h2>
//           </div>
          
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7042D2]"></div>
//             </div>
//           ) : dashboardData.statistics.totalPayments > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={getStatusData()}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   nameKey="name"
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {getStatusData().map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip 
//                   formatter={(value) => [value, 'Transactions']}
//                   contentStyle={{
//                     backgroundColor: darkMode ? '#374151' : '#FFFFFF',
//                     border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
//                     borderRadius: '8px',
//                     color: darkMode ? '#FFFFFF' : '#1F2937'
//                   }}
//                 />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//               <p>No transaction data available</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Recent Fee Transactions */}
//       <div className={`rounded-lg shadow-sm p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//         <div className="flex items-center justify-between mb-6">
//           <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//             Recent Fee Transactions
//           </h2>
//           <Link 
//             to="/transaction-fees"
//             className="text-md border border-gray-300 text-[#7042D2] font-semibold px-3 py-1 rounded-md hover:bg-[#7042D2] hover:text-white transition-colors"
//           >
//             View all fees
//           </Link>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
//           </div>
//         ) : dashboardData.feeTransactions.length === 0 ? (
//           <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//             <p className="text-lg">No fee transactions yet</p>
//             <p className="mt-2">Fee transactions will appear here as payments are processed</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className={`text-left border-b ${
//                   darkMode 
//                     ? 'text-gray-300 border-gray-700' 
//                     : 'text-gray-500 border-gray-200'
//                 }`}>
//                   <th className="pb-3 font-medium">Merchant</th>
//                   <th className="pb-3 font-medium">Original Amount</th>
//                   <th className="pb-3 font-medium">Fee Amount</th>
//                   <th className="pb-3 font-medium">Currency</th>
//                   <th className="pb-3 font-medium">Network</th>
//                   <th className="pb-3 font-medium">Status</th>
//                   <th className="pb-3 font-medium">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dashboardData.feeTransactions.slice(0, 5).map(fee => (
//                   <tr key={fee.id} className={`border-b ${
//                     darkMode 
//                       ? 'border-gray-700 hover:bg-gray-700' 
//                       : 'border-gray-100 hover:bg-gray-50'
//                   }`}>
//                     <td className={`py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
//                       {fee.merchantName}
//                     </td>
//                     <td className={`py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
//                       ${formatCurrency(fee.originalAmount)}
//                     </td>
//                     <td className="py-4 font-semibold text-green-600">
//                       ${formatCurrency(fee.feeAmount)}
//                     </td>
//                     <td className={`py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
//                       {fee.currency}
//                     </td>
//                     <td className={`py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
//                       {fee.network}
//                     </td>
//                     <td className="py-4">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         fee.status === 'completed' 
//                           ? 'bg-green-100 text-green-800' 
//                           : fee.status === 'pending' 
//                             ? 'bg-yellow-100 text-yellow-800' 
//                             : 'bg-red-100 text-red-800'
//                       }`}>
//                         {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className={`py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                       {new Date(fee.createdAt).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Newest Merchants */}
//       <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//         <div className="flex items-center justify-between mb-6">
//           <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//             Newest Merchants
//           </h2>
//           <Link 
//             to="/merchants"
//             className="text-md border border-gray-300 text-[#7042D2] font-semibold px-3 py-1 rounded-md hover:bg-[#7042D2] hover:text-white transition-colors"
//           >
//             View all merchants
//           </Link>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
//           </div>
//         ) : dashboardData.merchants.data.length === 0 ? (
//           <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//             <p className="text-lg">No merchants yet</p>
//             <p className="mt-2">Merchants will appear here as they register</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className={`text-left border-b ${
//                   darkMode 
//                     ? 'text-gray-300 border-gray-700' 
//                     : 'text-gray-500 border-gray-200'
//                 }`}>
//                   <th className="pb-3 font-medium">Business Name</th>
//                   <th className="pb-3 font-medium">Email</th>
//                   <th className="pb-3 font-medium">Status</th>
//                   <th className="pb-3 font-medium">Join Date</th>
//                   <th className="pb-3 font-medium">Wallet Address</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dashboardData.merchants.data.slice(0, 5).map(merchant => (
//                   <tr key={merchant.id} className={`border-b ${
//                     darkMode 
//                       ? 'border-gray-700 hover:bg-gray-700' 
//                       : 'border-gray-100 hover:bg-gray-50'
//                   }`}>
//                     <td className={`py-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
//                       {merchant.businessName}
//                     </td>
//                     <td className={`py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
//                       {merchant.email}
//                     </td>
//                     <td className="py-4">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         merchant.status === 'active' 
//                           ? 'bg-green-100 text-green-800' 
//                           : merchant.status === 'suspended' 
//                             ? 'bg-red-100 text-red-800' 
//                             : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className={`py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                       {new Date(merchant.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className={`py-4 font-mono text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                       {merchant.walletAddress 
//                         ? `${merchant.walletAddress.substring(0, 8)}...${merchant.walletAddress.substring(merchant.walletAddress.length - 6)}` 
//                         : 'Not set'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Dashboard;





// src/pages/Dashboard.jsx - Updated with Fee Processing Integration
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../url';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ArrowUp, 
  ArrowDown, 
  RefreshCw,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Store,
  Users,
  ChartColumn,
  TrendingUp,
  Activity,
  Settings,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [dashboardData, setDashboardData] = useState({
    merchants: { data: [], count: 0 },
    statistics: {
      totalMerchants: 0,
      totalPayments: 0,
      completedPayments: 0,
      pendingPayments: 0,
      totalRevenue: 0,
      totalFeeRevenue: 0,
      conversionRate: 0
    },
    feeTransactions: [],
    monthlyStats: []
  });
  
  const [timeframe, setTimeframe] = useState('last7Days');
  const [refreshing, setRefreshing] = useState(false);
  
  // Fee processing states
  const [feeProcessing, setFeeProcessing] = useState(false);
  const [pendingFeesCount, setPendingFeesCount] = useState(0);
  const [failedFeesCount, setFailedFeesCount] = useState(0);

  // Fetch dashboard data from admin API
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.data && response.data.success) {
        setDashboardData(response.data.data);
        
        // Count pending and failed fees
        const pendingCount = response.data.data.feeTransactions.filter(fee => fee.status === 'pending').length;
        const failedCount = response.data.data.feeTransactions.filter(fee => fee.status === 'failed').length;
        setPendingFeesCount(pendingCount);
        setFailedFeesCount(failedCount);
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to load dashboard data. Please check your connection and try again.');
      }
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
        
        // Refresh dashboard data
        await fetchDashboardData();
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
        
        // Refresh dashboard data
        await fetchDashboardData();
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
  
  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError('Please log in to access the dashboard.');
    }
  }, [user]);
  
  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };
  
  // Format currency for display
  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
  };
  
  // Generate chart colors
  const COLORS = ['#7042D2', '#50AF95', '#F6B87E', '#8884d8', '#FF6384', '#36A2EB'];
  
  // Get chart data based on timeframe
  const getChartData = () => {
    if (dashboardData.monthlyStats && dashboardData.monthlyStats.length > 0) {
      let filteredData = [...dashboardData.monthlyStats];
      
      // Apply timeframe filter
      if (timeframe === 'last7Days') {
        filteredData = filteredData.slice(-3);
      } else if (timeframe === 'last30Days') {
        filteredData = filteredData.slice(-6);
      }
      
      return filteredData;
    }
    
    return [];
  };
  
  // Get status distribution data for pie chart
  const getStatusData = () => {
    const { totalPayments, completedPayments, pendingPayments } = dashboardData.statistics;
    const failedPayments = totalPayments - completedPayments - pendingPayments;
    
    return [
      { name: 'Completed', value: completedPayments },
      { name: 'Pending', value: pendingPayments },
      { name: 'Failed', value: Math.max(0, failedPayments) }
    ].filter(item => item.value > 0);
  };

  return (
    <>
      {/* Welcome message */}
      <div className={`px-6 py-8 w-full mb-8 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={`font-bold text-3xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>Admin Dashboard</p>
        <p className={`text-lg pt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Welcome back {user?.name}!
        </p>
      </div>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
            <XCircle size={18} />
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
            <XCircle size={18} />
          </button>
        </div>
      )}
      
      {/* Fee Processing Controls */}
      {(pendingFeesCount > 0 || failedFeesCount > 0) && (
        <div className={`rounded-lg shadow-sm p-6 mb-8 border-l-4 border-yellow-400 ${
          darkMode ? 'bg-yellow-900/20 border-yellow-400' : 'bg-yellow-50 border-yellow-400'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                Fee Processing Required
              </h3>
              <div className={`mt-2 text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                {pendingFeesCount > 0 && (
                  <p>• {pendingFeesCount} pending fee(s) need to be processed</p>
                )}
                {failedFeesCount > 0 && (
                  <p>• {failedFeesCount} failed fee(s) need to be retried</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {pendingFeesCount > 0 && (
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
                  Process Pending
                </button>
              )}
              
              {failedFeesCount > 0 && (
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
                  Retry Failed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Data Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleTimeframeChange('last7Days')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              timeframe === 'last7Days' 
                ? 'bg-[#7042D2] text-white' 
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => handleTimeframeChange('last30Days')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              timeframe === 'last30Days' 
                ? 'bg-[#7042D2] text-white' 
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Last 30 Days
          </button>
          <button 
            onClick={() => handleTimeframeChange('last90Days')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              timeframe === 'last90Days' 
                ? 'bg-[#7042D2] text-white' 
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Last 90 Days
          </button>
        </div>
        
        <button 
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
            darkMode
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>

      {/* Quick Stats - Enhanced with Fee Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Total Merchants */}
        <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-purple-100">
              <Store size={20} className="text-[#7042D2]" />
            </div>
            <h3 className={`ml-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Total Merchants
            </h3>
          </div>
          <div className="flex items-end mt-2 justify-between">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {dashboardData.statistics.totalMerchants}
            </span>
            <span className="text-sm flex items-center text-green-500">
              <ArrowUp size={14} className="mr-1" />
              +12.5%
            </span>
          </div>
        </div>
        
        {/* Total Transactions */}
        <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-blue-100">
              <Activity size={20} className="text-blue-600" />
            </div>
            <h3 className={`ml-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Total Transactions
            </h3>
          </div>
          <div className="flex items-end mt-2 justify-between">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {dashboardData.statistics.totalPayments}
            </span>
            <span className="text-sm flex items-center text-green-500">
              <ArrowUp size={14} className="mr-1" />
              +8.2%
            </span>
          </div>
        </div>
        
        {/* Total Platform Revenue */}
        <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-green-100">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <h3 className={`ml-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Platform Revenue
            </h3>
          </div>
          <div className="flex items-end mt-2 justify-between">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              ${formatCurrency(dashboardData.statistics.totalRevenue)}
            </span>
            <span className="text-sm flex items-center text-green-500">
              <TrendingUp size={14} className="mr-1" />
              +15.3%
            </span>
          </div>
        </div>
        
        {/* Fee Revenue */}
        <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-yellow-100">
              <ChartColumn size={20} className="text-yellow-600" />
            </div>
            <h3 className={`ml-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Fee Revenue
            </h3>
          </div>
          <div className="flex items-end mt-2 justify-between">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              ${formatCurrency(dashboardData.statistics.totalFeeRevenue)}
            </span>
            <span className="text-sm flex items-center text-green-500">
              <ArrowUp size={14} className="mr-1" />
              +22.7%
            </span>
          </div>
        </div>

        {/* Fee Processing Status */}
        <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-md ${
              pendingFeesCount + failedFeesCount > 0 ? 'bg-orange-100' : 'bg-green-100'
            }`}>
              {pendingFeesCount + failedFeesCount > 0 ? (
                <Clock size={20} className="text-orange-600" />
              ) : (
                <CheckCircle size={20} className="text-green-600" />
              )}
            </div>
            <h3 className={`ml-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Fee Processing
            </h3>
          </div>
          <div className="flex items-end mt-2 justify-between">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {pendingFeesCount + failedFeesCount === 0 ? 'Up to date' : `${pendingFeesCount + failedFeesCount}`}
            </span>
            <span className={`text-xs ${
              pendingFeesCount + failedFeesCount === 0 ? 'text-green-500' : 'text-orange-500'
            }`}>
              {pendingFeesCount + failedFeesCount === 0 ? 'All processed' : 'Need attention'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className={`rounded-lg shadow-sm p-6 lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Monthly Revenue Overview
            </h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7042D2]"></div>
            </div>
          ) : dashboardData.monthlyStats && dashboardData.monthlyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                />
                <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  formatter={(value) => [`${formatCurrency(value)}`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    backgroundColor: darkMode ? '#374151' : '#FFFFFF',
                    border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: darkMode ? '#FFFFFF' : '#1F2937'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#7042D2"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="transactions"
                  name="Transactions"
                  stroke="#50AF95"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p>No revenue data available</p>
              <p className="text-sm mt-2">Data will appear here as transactions are processed</p>
            </div>
          )}
        </div>
        
        {/* Transaction Status Distribution */}
        <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Transaction Status
            </h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7042D2]"></div>
            </div>
          ) : dashboardData.statistics.totalPayments > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {getStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Transactions']}
                  contentStyle={{
                    backgroundColor: darkMode ? '#374151' : '#FFFFFF',
                    border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: darkMode ? '#FFFFFF' : '#1F2937'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p>No transaction data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Fee Transactions - Enhanced with Status Indicators */}
      <div className={`rounded-lg shadow-sm p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Recent Fee Transactions
          </h2>
          <Link 
            to="/transaction-fees"
            className="text-md border border-gray-300 text-[#7042D2] font-semibold px-3 py-1 rounded-md hover:bg-[#7042D2] hover:text-white transition-colors"
          >
            View all fees
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
          </div>
        ) : dashboardData.feeTransactions.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-lg">No fee transactions yet</p>
            <p className="mt-2">Fee transactions will appear here as payments are processed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left border-b ${
                  darkMode 
                    ? 'text-gray-300 border-gray-700' 
                    : 'text-gray-500 border-gray-200'
                }`}>
                  <th className="pb-3 font-medium">Merchant</th>
                  <th className="pb-3 font-medium">Original Amount</th>
                  <th className="pb-3 font-medium">Fee Amount</th>
                  <th className="pb-3 font-medium">Currency</th>
                  <th className="pb-3 font-medium">Network</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.feeTransactions.slice(0, 5).map(fee => (
                  <tr key={fee.id} className={`border-b ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}>
                    <td className={`py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {fee.merchantName}
                    </td>
                    <td className={`py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      ${formatCurrency(fee.originalAmount)}
                    </td>
                    <td className="py-4 font-semibold text-green-600">
                      ${formatCurrency(fee.feeAmount)}
                    </td>
                    <td className={`py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {fee.currency}
                    </td>
                    <td className={`py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {fee.network}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center ${
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
                    <td className={`py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(fee.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Newest Merchants */}
      <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Newest Merchants
          </h2>
          <Link 
            to="/merchants"
            className="text-md border border-gray-300 text-[#7042D2] font-semibold px-3 py-1 rounded-md hover:bg-[#7042D2] hover:text-white transition-colors"
          >
            View all merchants
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
          </div>
        ) : dashboardData.merchants.data.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-lg">No merchants yet</p>
            <p className="mt-2">Merchants will appear here as they register</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left border-b ${
                  darkMode 
                    ? 'text-gray-300 border-gray-700' 
                    : 'text-gray-500 border-gray-200'
                }`}>
                  <th className="pb-3 font-medium">Business Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Join Date</th>
                  <th className="pb-3 font-medium">Wallet Address</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.merchants.data.slice(0, 5).map(merchant => (
                  <tr key={merchant.id} className={`border-b ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}>
                    <td className={`py-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {merchant.businessName}
                    </td>
                    <td className={`py-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {merchant.email}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        merchant.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : merchant.status === 'suspended' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1)}
                      </span>
                    </td>
                    <td className={`py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(merchant.createdAt).toLocaleDateString()}
                    </td>
                    <td className={`py-4 font-mono text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {merchant.walletAddress 
                        ? `${merchant.walletAddress.substring(0, 8)}...${merchant.walletAddress.substring(merchant.walletAddress.length - 6)}` 
                        : 'Not set'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;