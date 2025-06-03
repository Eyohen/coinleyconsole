// // src/pages/Dashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { URL } from '../url';
// import { useAuth } from '../context/AuthContext';
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
// } from 'lucide-react';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [statistics, setStatistics] = useState({
//     currency: [],
//     status: [],
//     monthly: []
//   });
  
//   const [dashboardStats, setDashboardStats] = useState({
//     totalRevenue: { value: "0", change: "0%" },
//     totalTransactions: { value: "0", change: "0%" },
//     completedRate: { value: "0%", change: "0%" },
//     pendingTransactions: { value: "0", change: "0%" }
//   });
  
//   const [timeframe, setTimeframe] = useState('last7Days');
//   const [refreshing, setRefreshing] = useState(false);

//   // Fetch transaction list
//   const fetchTransactions = async () => {
//     try {
//       const res = await axios.get(`${URL}/api/payments/merchant/list`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//           'x-api-key': user?.apiKey || '',
//           'x-api-secret': user?.apiSecret || ''
//         }
//       });
      
//       if (res.data && res.data.success) {
//         setTransactions(res.data.payments.data);
//       }
//     } catch (err) {
//       console.error('Error fetching transactions:', err);
//       setError('Failed to load transactions. Please try again.');
//     }
//   };

//   // Fetch statistics
//   const fetchStats = async () => {
//     try {
//       const res = await axios.get(`${URL}/api/payments/merchant/stats`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//           'x-api-key': user?.apiKey || '',
//           'x-api-secret': user?.apiSecret || ''
//         }
//       });
      
//       if (res.data && res.data.success) {
//         setStatistics(res.data.stats);
        
//         // Calculate dashboard stats from the data
//         calculateDashboardStats(res.data.stats);
//       }
//     } catch (err) {
//       console.error('Error fetching statistics:', err);
//       setError('Failed to load statistics. Please try again.');
//     }
//   };
  
//   // Calculate dashboard stats based on the data received
//   const calculateDashboardStats = (stats) => {
//     try {
//       // Total Revenue - sum of all transaction amounts
//       let totalAmount = 0;
//       if (stats.monthly && stats.monthly.length > 0) {
//         totalAmount = stats.monthly.reduce((sum, month) => sum + parseFloat(month.totalAmount || 0), 0);
//       }
      
//       // Transaction status counts
//       const statusCounts = {
//         total: 0,
//         completed: 0,
//         pending: 0
//       };
      
//       if (stats.status && stats.status.length > 0) {
//         stats.status.forEach(item => {
//           const count = parseInt(item.count || 0);
//           statusCounts.total += count;
          
//           if (item.status === 'completed') {
//             statusCounts.completed = count;
//           } else if (item.status === 'pending') {
//             statusCounts.pending = count;
//           }
//         });
//       }
      
//       // Calculate month-over-month change
//       let revenueChange = "0%";
//       let transactionsChange = "0%";
      
//       if (stats.monthly && stats.monthly.length >= 2) {
//         const lastMonth = stats.monthly[stats.monthly.length - 1];
//         const previousMonth = stats.monthly[stats.monthly.length - 2];
        
//         if (previousMonth.totalAmount > 0) {
//           const change = ((lastMonth.totalAmount - previousMonth.totalAmount) / previousMonth.totalAmount) * 100;
//           revenueChange = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
//         }
        
//         if (previousMonth.count > 0) {
//           const change = ((lastMonth.count - previousMonth.count) / previousMonth.count) * 100;
//           transactionsChange = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
//         }
//       }
      
//       // Format values for display
//       setDashboardStats({
//         totalRevenue: { 
//           value: totalAmount ? totalAmount.toFixed(2) : "0", 
//           change: revenueChange 
//         },
//         totalTransactions: { 
//           value: statusCounts.total.toString(), 
//           change: transactionsChange 
//         },
//         completedRate: { 
//           value: statusCounts.total > 0 
//             ? `${((statusCounts.completed / statusCounts.total) * 100).toFixed(1)}%` 
//             : "0%", 
//           change: "0%" 
//         },
//         pendingTransactions: { 
//           value: statusCounts.pending.toString(), 
//           change: "0%" 
//         }
//       });
//     } catch (error) {
//       console.error('Error calculating dashboard stats:', error);
//     }
//   };

//   // Fetch all data
//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       await Promise.all([
//         fetchTransactions(),
//         fetchStats()
//       ]);
//     } catch (err) {
//       console.error('Error fetching dashboard data:', err);
//       setError('Failed to load dashboard data. Please try again.');
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
//     // Only fetch data if user is loaded and has API credentials
//     if (user && user.apiKey && user.apiSecret) {
//       fetchDashboardData();
//     } else {
//       setLoading(false);
//       setError('Missing API credentials. Please check your account settings.');
//     }
//   }, [user]);
  
//   // Handle timeframe change
//   const handleTimeframeChange = (newTimeframe) => {
//     setTimeframe(newTimeframe);
//     // In a real implementation, you might want to refetch data with different date ranges
//   };
  
//   // Format currency for display
//   const formatCurrency = (amount) => {
//     return parseFloat(amount).toFixed(2);
//   };
  
//   // Generate chart colors
//   const COLORS = ['#7042D2', '#50AF95', '#F6B87E', '#8884d8', '#FF6384', '#36A2EB'];
  
//   // Get chart data based on timeframe
//   const getChartData = () => {
//     if (statistics.monthly && statistics.monthly.length > 0) {
//       let filteredData = [...statistics.monthly];
      
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
//     if (statistics.status && statistics.status.length > 0) {
//       return statistics.status.map(item => ({
//         name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
//         value: parseInt(item.count || 0)
//       }));
//     }
    
//     return [
//       { name: 'Pending', value: 0 },
//       { name: 'Completed', value: 0 },
//       { name: 'Failed', value: 0 }
//     ];
//   };

//   return (
//     <>
//       {/* Welcome message */}
//       <div className="px-6 py-8 rounded-2xl shadow-lg w-full border mb-8 bg-white">
//         <p className="font-bold text-3xl">Dashboard</p>
//         <p className="text-lg text-gray-600 pt-2">Welcome back {user?.businessName}!</p>
//       </div>
      
//       {error && (
//         <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 flex items-center">
//           <AlertCircle className="mr-2" size={20} />
//           <span>{error}</span>
//           {error.includes('API credentials') && (
//             <Link 
//               to="/profile"
//               className="ml-4 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
//             >
//               View Profile
//             </Link>
//           )}
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
//                 : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             Last 7 Days
//           </button>
//           <button 
//             onClick={() => handleTimeframeChange('last30Days')}
//             className={`px-3 py-2 rounded-md text-sm font-medium ${
//               timeframe === 'last30Days' 
//                 ? 'bg-[#7042D2] text-white' 
//                 : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             Last 30 Days
//           </button>
//           <button 
//             onClick={() => handleTimeframeChange('last90Days')}
//             className={`px-3 py-2 rounded-md text-sm font-medium ${
//               timeframe === 'last90Days' 
//                 ? 'bg-[#7042D2] text-white' 
//                 : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             Last 90 Days
//           </button>
//         </div>
        
//         <button 
//           onClick={handleRefresh}
//           disabled={refreshing || loading}
//           className="flex items-center gap-2 bg-white px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//         >
//           <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
//           <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
//         </button>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Total Revenue */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-purple-100">
//               <Users size={20} className="text-[#7042D2]" />
//             </div>
//             <h3 className="ml-3 text-sm font-medium text-gray-500">Total Customers</h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className="text-2xl font-bold">${dashboardStats.totalRevenue.value}</span>
//             <span className={`text-sm flex items-center ${
//               dashboardStats.totalRevenue.change.startsWith('+') 
//                 ? 'text-green-500' 
//                 : dashboardStats.totalRevenue.change.startsWith('-') 
//                   ? 'text-red-500' 
//                   : 'text-gray-500'
//             }`}>
//               {dashboardStats.totalRevenue.change.startsWith('+') ? (
//                 <ArrowUp size={14} className="mr-1" />
//               ) : dashboardStats.totalRevenue.change.startsWith('-') ? (
//                 <ArrowDown size={14} className="mr-1" />
//               ) : null}
//               {dashboardStats.totalRevenue.change}
//             </span>
//           </div>
//         </div>
        
//         {/* Total Transactions */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-blue-100">
//               <Store size={20} className="text-blue-600" />
//             </div>
//             <h3 className="ml-3 text-sm font-medium text-gray-500">Total Merchants</h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className="text-2xl font-bold">{dashboardStats.totalTransactions.value}</span>
//             <span className={`text-sm flex items-center ${
//               dashboardStats.totalTransactions.change.startsWith('+') 
//                 ? 'text-green-500' 
//                 : dashboardStats.totalTransactions.change.startsWith('-') 
//                   ? 'text-red-500' 
//                   : 'text-gray-500'
//             }`}>
//               {dashboardStats.totalTransactions.change.startsWith('+') ? (
//                 <ArrowUp size={14} className="mr-1" />
//               ) : dashboardStats.totalTransactions.change.startsWith('-') ? (
//                 <ArrowDown size={14} className="mr-1" />
//               ) : null}
//               {dashboardStats.totalTransactions.change}
//             </span>
//           </div>
//         </div>
        
//         {/* Completion Rate */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-green-100">
//               <DollarSign size={20} className="text-green-600" />
//             </div>
//             <h3 className="ml-3 text-sm font-medium text-gray-500">Total Revenue</h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className="text-2xl font-bold">{dashboardStats.completedRate.value}</span>
//             <span className={`text-sm flex items-center ${
//               dashboardStats.completedRate.change.startsWith('+') 
//                 ? 'text-green-500' 
//                 : dashboardStats.completedRate.change.startsWith('-') 
//                   ? 'text-red-500' 
//                   : 'text-gray-500'
//             }`}>
//               {dashboardStats.completedRate.change.startsWith('+') ? (
//                 <ArrowUp size={14} className="mr-1" />
//               ) : dashboardStats.completedRate.change.startsWith('-') ? (
//                 <ArrowDown size={14} className="mr-1" />
//               ) : null}
//               {dashboardStats.completedRate.change}
//             </span>
//           </div>
//         </div>
        
//         {/* Pending Transactions */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center">
//             <div className="p-2 rounded-md bg-yellow-100">
//               <ChartColumn size={20} className="text-yellow-600" />
//             </div>
//             <h3 className="ml-3 text-sm font-medium text-gray-500">Conversion Rate</h3>
//           </div>
//           <div className="flex items-end mt-2 justify-between">
//             <span className="text-2xl font-bold">{dashboardStats.pendingTransactions.value}</span>
//             <span className={`text-sm flex items-center ${
//               dashboardStats.pendingTransactions.change.startsWith('+') 
//                 ? 'text-yellow-500' 
//                 : dashboardStats.pendingTransactions.change.startsWith('-') 
//                   ? 'text-green-500' 
//                   : 'text-gray-500'
//             }`}>
//               {dashboardStats.pendingTransactions.change.startsWith('+') ? (
//                 <ArrowUp size={14} className="mr-1" />
//               ) : dashboardStats.pendingTransactions.change.startsWith('-') ? (
//                 <ArrowDown size={14} className="mr-1" />
//               ) : null}
//               {dashboardStats.pendingTransactions.change}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Revenue Chart */}
//         <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-medium">Transaction Overview</h2>
//           </div>
          
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7042D2]"></div>
//             </div>
//           ) : statistics.monthly && statistics.monthly.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={getChartData()}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip 
//                   formatter={(value) => [`$${formatCurrency(value)}`, 'Revenue']}
//                   labelFormatter={(label) => `Month: ${label}`}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="totalAmount"
//                   name="Revenue"
//                   stroke="#7042D2"
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                   activeDot={{ r: 6 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//               <p>No revenue data available</p>
//               <p className="text-sm mt-2">Completed transactions will appear here</p>
//             </div>
//           )}
//         </div>
        
//         {/* Status Distribution */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-medium">Total Sales</h2>
//           </div>
          
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7042D2]"></div>
//             </div>
//           ) : statistics.status && statistics.status.length > 0 ? (
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
//                 <Tooltip formatter={(value) => [value, 'Transactions']} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//               <p>No status data available</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold">Recent Transactions</h2>
//           <Link 
//             to="/transactions"
//             className="text-md border border-gray-300 text-[#7042D2] font-semibold px-3 py-1 rounded-md"
//           >
//             View all transactions
//           </Link>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
//           </div>
//         ) : transactions.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             <p className="text-lg">No transactions yet</p>
//             <p className="mt-2">Transactions will appear here as they are processed</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left text-gray-500 border-b border-gray-200">
//                   <th className="pb-3 font-medium">Merchant</th>
//                   <th className="pb-3 font-medium">Amount</th>
//                   <th className="pb-3 font-medium">Currency</th>
//                   <th className="pb-3 font-medium">Status</th>
//                   <th className="pb-3 font-medium">Date</th>
//                   <th className="pb-3 font-medium">Tx Hash</th>
//                   <th className="pb-3 font-medium"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.map(tx => (
//                   <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-4">{tx.id.substring(0, 8)}...</td>
//                     <td className="py-4">${formatCurrency(tx.amount)}</td>
//                     <td className="py-4">{tx.currency}</td>
//                     <td className="py-4">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         tx.status === 'completed' 
//                           ? 'bg-green-100 text-green-800' 
//                           : tx.status === 'pending' 
//                             ? 'bg-yellow-100 text-yellow-800' 
//                             : 'bg-red-100 text-red-800'
//                       }`}>
//                         {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="py-4 text-gray-500">
//                       {new Date(tx.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="py-4 font-mono text-xs">
//                       {tx.transactionHash 
//                         ? `${tx.transactionHash.substring(0, 8)}...` 
//                         : '-'}
//                     </td>
//                     <td className="py-4">
//                       {tx.transactionHash && (
//                         <a 
//                           href={`https://etherscan.io/tx/${tx.transactionHash}`} 
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-[#7042D2] hover:underline flex items-center"
//                         >
//                           <ExternalLink size={14} className="ml-1" />
//                         </a>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>




      
//       {/*Newest Merchants */}
//       <div className="bg-white rounded-lg shadow-sm p-6 mt-9">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold">Newest Merchants</h2>
//           <Link 
//             to="/transactions"
//             className="text-md border border-gray-300 text-[#7042D2] font-semibold px-3 py-1 rounded-md"
//           >
//             View all merchants
//           </Link>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
//           </div>
//         ) : transactions.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             <p className="text-lg">No transactions yet</p>
//             <p className="mt-2">Transactions will appear here as they are processed</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left text-gray-500 border-b border-gray-200">
//                   <th className="pb-3 font-medium">Merchant</th>
//                   <th className="pb-3 font-medium">Category</th>
//                   <th className="pb-3 font-medium">Location</th>
//                   <th className="pb-3 font-medium">Status</th>
//                   <th className="pb-3 font-medium">Join Date</th>

//                   <th className="pb-3 font-medium"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.map(tx => (
//                   <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-4">{tx.id.substring(0, 8)}...</td>
//                     <td className="py-4">${formatCurrency(tx.amount)}</td>
//                     <td className="py-4">{tx.currency}</td>
//                     <td className="py-4">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         tx.status === 'completed' 
//                           ? 'bg-green-100 text-green-800' 
//                           : tx.status === 'pending' 
//                             ? 'bg-yellow-100 text-yellow-800' 
//                             : 'bg-red-100 text-red-800'
//                       }`}>
//                         {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="py-4 text-gray-500">
//                       {new Date(tx.createdAt).toLocaleDateString()}
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







// src/pages/Dashboard.jsx - Updated for Admin
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
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    // In a real implementation, you might want to refetch data with different date ranges
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
        // For demo, just take the most recent data points
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

  // Calculate percentage changes (mock data for now)
  const getPercentageChange = (current, previous = 0) => {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
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
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Recent Fee Transactions */}
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
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        fee.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : fee.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </span>
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