// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { URL } from '../url';
// import { 
//   RiAddCircleLine, 
//   RiDeleteBin6Line, 
//   RiEyeLine, 
//   RiEyeOffLine, 
//   RiWallet3Line, 
//   RiBankLine,
//   RiEditLine,
//   RiCheckboxCircleFill
// } from 'react-icons/ri';
// import { useAuth } from '../context/AuthContext';

// const Payments = () => {
//   const { user } = useAuth();
//   const [paymentMethods, setPaymentMethods] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [methodType, setMethodType] = useState('crypto');
//   const [hiddenAddresses, setHiddenAddresses] = useState({});
//   const [formData, setFormData] = useState({
//     name: '',
//     address: '',
//     bankName: '',
//     accountNumber: '',
//     accountName: '',
//     routingNumber: '',
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formError, setFormError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Fetch payment methods
//   const fetchPaymentMethods = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${URL}/api/payment-methods`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`
//         }
//       });
//       setPaymentMethods(response.data);
//     } catch (error) {
//       console.error('Error fetching payment methods:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPaymentMethods();
//   }, []);

//   // Toggle address visibility
//   const toggleAddressVisibility = (id) => {
//     setHiddenAddresses(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setFormError('');
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setFormError('');

//     // Form validation
//     if (methodType === 'crypto' && (!formData.name || !formData.address)) {
//       setFormError('Please fill in all required fields');
//       setIsSubmitting(false);
//       return;
//     }

//     if (methodType === 'bank' && (!formData.bankName || !formData.accountNumber || !formData.accountName)) {
//       setFormError('Please fill in all required fields');
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const paymentMethodData = methodType === 'crypto' 
//         ? {
//             type: 'crypto',
//             name: formData.name,
//             address: formData.address,
//             merchantId: user.id
//           }
//         : {
//             type: 'bank',
//             bankName: formData.bankName,
//             accountNumber: formData.accountNumber,
//             accountName: formData.accountName,
//             routingNumber: formData.routingNumber,
//             merchantId: user.id
//           };

//       await axios.post(`${URL}/api/payment-methods`, paymentMethodData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`
//         }
//       });

//       // Reset form and fetch updated methods
//       setFormData({
//         name: '',
//         address: '',
//         bankName: '',
//         accountNumber: '',
//         accountName: '',
//         routingNumber: '',
//       });
//       setSuccessMessage('Payment method added successfully!');
      
//       // Clear success message after 3 seconds
//       setTimeout(() => {
//         setSuccessMessage('');
//         setAddModalOpen(false);
//         fetchPaymentMethods();
//       }, 3000);

//     } catch (error) {
//       console.error('Error adding payment method:', error);
//       setFormError('Failed to add payment method. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle payment method deletion
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this payment method?')) {
//       try {
//         await axios.delete(`${URL}/api/payment-methods/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('access_token')}`
//           }
//         });
//         fetchPaymentMethods();
//       } catch (error) {
//         console.error('Error deleting payment method:', error);
//       }
//     }
//   };

//   // Format address for display (show first 6 and last 4 characters if hidden)
//   const formatAddress = (address, isHidden) => {
//     if (!isHidden) return address;
//     return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Payment Methods</h1>
//         <button 
//           onClick={() => setAddModalOpen(true)}
//           className="flex items-center gap-2 bg-[#7042D2] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
//         >
//           <RiAddCircleLine className="text-lg" />
//           Add Payment Method
//         </button>
//       </div>

//       {/* Payment methods list */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         {loading ? (
//           <div className="flex justify-center py-8">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
//           </div>
//         ) : paymentMethods.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <RiWallet3Line className="mx-auto text-5xl mb-3 text-gray-400" />
//             <p>No payment methods added yet.</p>
//             <p className="mt-2">Add your first payment method to start receiving payments.</p>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-200">
//             <div className="grid grid-cols-12 font-semibold text-gray-600 pb-4 mb-4">
//               <div className="col-span-3">Type</div>
//               <div className="col-span-4">Name/Bank</div>
//               <div className="col-span-4">Address/Account</div>
//               <div className="col-span-1">Actions</div>
//             </div>
//             {paymentMethods.map((method) => (
//               <div key={method.id} className="grid grid-cols-12 py-4 items-center">
//                 <div className="col-span-3 flex items-center">
//                   {method.type === 'crypto' ? (
//                     <div className="flex items-center">
//                       <RiWallet3Line className="text-[#7042D2] mr-2" />
//                       <span>Crypto Wallet</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center">
//                       <RiBankLine className="text-[#7042D2] mr-2" />
//                       <span>Bank Account</span>
//                     </div>
//                   )}
//                 </div>
//                 <div className="col-span-4">
//                   {method.type === 'crypto' ? method.name : method.bankName}
//                 </div>
//                 <div className="col-span-4 flex items-center">
//                   {method.type === 'crypto' ? (
//                     <div className="flex items-center">
//                       <span className="font-mono">
//                         {formatAddress(
//                           method.address, 
//                           hiddenAddresses[method.id]
//                         )}
//                       </span>
//                       <button 
//                         onClick={() => toggleAddressVisibility(method.id)}
//                         className="ml-2 text-gray-500 hover:text-gray-700"
//                       >
//                         {hiddenAddresses[method.id] ? (
//                           <RiEyeLine className="text-lg" />
//                         ) : (
//                           <RiEyeOffLine className="text-lg" />
//                         )}
//                       </button>
//                     </div>
//                   ) : (
//                     <span>{method.accountNumber ? `****${method.accountNumber.slice(-4)}` : ''}</span>
//                   )}
//                 </div>
//                 <div className="col-span-1 flex gap-2">
//                   <button 
//                     onClick={() => handleDelete(method.id)}
//                     className="text-red-500 hover:text-red-700"
//                     aria-label="Delete payment method"
//                   >
//                     <RiDeleteBin6Line />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Add Payment Method Modal */}
//       {addModalOpen && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
//             <button
//               onClick={() => setAddModalOpen(false)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-bold mb-4">Add Payment Method</h2>
            
//             {/* Method Type Selector */}
//             <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
//               <button
//                 className={`flex-1 py-2 rounded-md ${
//                   methodType === 'crypto'
//                     ? 'bg-white shadow-sm text-[#7042D2]'
//                     : 'text-gray-600'
//                 }`}
//                 onClick={() => setMethodType('crypto')}
//               >
//                 <div className="flex items-center justify-center gap-2">
//                   <RiWallet3Line />
//                   <span>Crypto Wallet</span>
//                 </div>
//               </button>
//               <button
//                 className={`flex-1 py-2 rounded-md ${
//                   methodType === 'bank'
//                     ? 'bg-white shadow-sm text-[#7042D2]'
//                     : 'text-gray-600'
//                 }`}
//                 onClick={() => setMethodType('bank')}
//               >
//                 <div className="flex items-center justify-center gap-2">
//                   <RiBankLine />
//                   <span>Bank Account</span>
//                 </div>
//               </button>
//             </div>
            
//             {/* Success Message */}
//             {successMessage && (
//               <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md flex items-center">
//                 <RiCheckboxCircleFill className="text-green-500 mr-2" />
//                 {successMessage}
//               </div>
//             )}
            
//             {/* Error Message */}
//             {formError && (
//               <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">
//                 {formError}
//               </div>
//             )}
            
//             {/* Form */}
//             <form onSubmit={handleSubmit}>
//               {methodType === 'crypto' ? (
//                 <>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-medium mb-2">
//                       Wallet Name*
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                       placeholder="e.g.,USDT, USDC,"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-medium mb-2">
//                       Wallet Address*
//                     </label>
//                     <input
//                       type="text"
//                       name="address"
//                       value={formData.address}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                       placeholder="0x..."
//                     />
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-medium mb-2">
//                       Bank Name*
//                     </label>
//                     <input
//                       type="text"
//                       name="bankName"
//                       value={formData.bankName}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                       placeholder="Enter bank name"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-medium mb-2">
//                       Account Number*
//                     </label>
//                     <input
//                       type="text"
//                       name="accountNumber"
//                       value={formData.accountNumber}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                       placeholder="Enter account number"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-medium mb-2">
//                       Account Name*
//                     </label>
//                     <input
//                       type="text"
//                       name="accountName"
//                       value={formData.accountName}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                       placeholder="Enter account name"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-medium mb-2">
//                       Routing Number (optional)
//                     </label>
//                     <input
//                       type="text"
//                       name="routingNumber"
//                       value={formData.routingNumber}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                       placeholder="Enter routing number"
//                     />
//                   </div>
//                 </>
//               )}
//               <div className="flex gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setAddModalOpen(false)}
//                   className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="flex-1 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
//                 >
//                   {isSubmitting ? 'Adding...' : 'Add Method'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Payments;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../url';
import { 
  RiAddCircleLine, 
  RiDeleteBin6Line, 
  RiEyeLine, 
  RiEyeOffLine, 
  RiWallet3Line, 
  RiBankLine,
  RiEditLine,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiInformationLine,
  RiRefreshLine,
  RiFileCopyLine
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

const Payments = () => {
  const { user, login } = useAuth();
  const [merchantData, setMerchantData] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editWalletModalOpen, setEditWalletModalOpen] = useState(false);
  const [methodType, setMethodType] = useState('crypto');
  const [hiddenAddresses, setHiddenAddresses] = useState({});
  const [hideMainWallet, setHideMainWallet] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    routingNumber: '',
  });
  const [walletFormData, setWalletFormData] = useState({
    walletAddress: '',
    solWalletAddress: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // Fetch merchant profile data
  const fetchMerchantProfile = async () => {
    try {
      const response = await axios.get(`${URL}/api/merchants/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'x-api-key': user?.apiKey || '',
          'x-api-secret': user?.apiSecret || ''
        }
      });
      
      if (response.data && response.data.merchant) {
        setMerchantData(response.data.merchant);
        
        // Initialize wallet form data with current values
        setWalletFormData({
          walletAddress: response.data.merchant.walletAddress || '',
          solWalletAddress: response.data.merchant.solWalletAddress || ''
        });
      }
    } catch (error) {
      console.error('Error fetching merchant profile:', error);
    }
  };

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`${URL}/api/payment-methods`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'x-api-key': user?.apiKey || '',
          'x-api-secret': user?.apiSecret || ''
        }
      });
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMerchantProfile(),
        fetchPaymentMethods()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.apiKey && user.apiSecret) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Toggle address visibility for main wallet
  const toggleMainWalletVisibility = () => {
    setHideMainWallet(!hideMainWallet);
  };

  // Toggle address visibility for other payment methods
  const toggleAddressVisibility = (id) => {
    setHiddenAddresses(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle payment method form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError('');
  };

  // Handle wallet form input changes
  const handleWalletChange = (e) => {
    const { name, value } = e.target;
    setWalletFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError('');
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Update primary wallet address
  const handleUpdateWallet = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    // Validation
    if (!walletFormData.walletAddress) {
      setFormError('Wallet address is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.put(`${URL}/api/merchants/profile`, walletFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'x-api-key': user?.apiKey || '',
          'x-api-secret': user?.apiSecret || ''
        }
      });

      if (response.data && response.data.success) {
        // Update merchant data
        setMerchantData({
          ...merchantData,
          walletAddress: walletFormData.walletAddress,
          solWalletAddress: walletFormData.solWalletAddress || merchantData.solWalletAddress
        });

        // Update auth context user data
        if (login && typeof login === 'function') {
          login({
            ...user,
            walletAddress: walletFormData.walletAddress,
            solWalletAddress: walletFormData.solWalletAddress || user.solWalletAddress
          });
        }

        setSuccessMessage('Wallet addresses updated successfully!');
        
        // Close modal after success
        setTimeout(() => {
          setSuccessMessage('');
          setEditWalletModalOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating wallet addresses:', error);
      setFormError('Failed to update wallet addresses. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment method form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    // Form validation
    if (methodType === 'crypto' && (!formData.name || !formData.address)) {
      setFormError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (methodType === 'bank' && (!formData.bankName || !formData.accountNumber || !formData.accountName)) {
      setFormError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const paymentMethodData = methodType === 'crypto' 
        ? {
            type: 'crypto',
            name: formData.name,
            address: formData.address,
            merchantId: user.id
          }
        : {
            type: 'bank',
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            accountName: formData.accountName,
            routingNumber: formData.routingNumber,
            merchantId: user.id
          };

      await axios.post(`${URL}/api/payment-methods`, paymentMethodData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'x-api-key': user?.apiKey || '',
          'x-api-secret': user?.apiSecret || ''
        }
      });

      // Reset form and fetch updated methods
      setFormData({
        name: '',
        address: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        routingNumber: '',
      });
      setSuccessMessage('Payment method added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        setAddModalOpen(false);
        fetchPaymentMethods();
      }, 3000);

    } catch (error) {
      console.error('Error adding payment method:', error);
      setFormError('Failed to add payment method. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment method deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await axios.delete(`${URL}/api/payment-methods/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'x-api-key': user?.apiKey || '',
            'x-api-secret': user?.apiSecret || ''
          }
        });
        fetchPaymentMethods();
      } catch (error) {
        console.error('Error deleting payment method:', error);
      }
    }
  };

  // Format address for display (show first 6 and last 4 characters if hidden)
  const formatAddress = (address, isHidden) => {
    if (!address) return '';
    if (!isHidden) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Check if wallet addresses are set
  const hasEthWallet = !!(merchantData && merchantData.walletAddress);
  const hasSolWallet = !!(merchantData && merchantData.solWalletAddress);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Payment Methods</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchData()}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-all"
          >
            <RiRefreshLine className="text-lg" />
            Refresh
          </button>
          <button 
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#7042D2] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
          >
            <RiAddCircleLine className="text-lg" />
            Add Payment Method
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7042D2]"></div>
        </div>
      ) : (
        <>
          {/* Primary Wallet Addresses Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-full mr-3">
                  <RiWallet3Line className="text-[#7042D2] text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Primary Wallet Addresses</h2>
                  <p className="text-sm text-gray-500">Your main wallet addresses for receiving payments</p>
                </div>
              </div>
              <button 
                onClick={() => setEditWalletModalOpen(true)}
                className="flex items-center gap-1 text-[#7042D2] border border-[#7042D2] px-3 py-1 rounded hover:bg-purple-50"
              >
                <RiEditLine />
                <span>Update</span>
              </button>
            </div>
            
            {!hasEthWallet && !hasSolWallet ? (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <RiWallet3Line className="mx-auto text-5xl mb-3 text-gray-400" />
                <p className="text-gray-500">No wallet addresses configured</p>
                <button 
                  onClick={() => setEditWalletModalOpen(true)}
                  className="mt-4 bg-[#7042D2] text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                  Add Wallet Addresses
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Ethereum Wallet */}
                {hasEthWallet && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">EVM Wallet (ETH, USDT, USDC)</span>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Primary</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center max-w-[70%]">
                        <span className="font-mono text-sm truncate">
                          {formatAddress(merchantData.walletAddress, hideMainWallet)}
                        </span>
                        <button 
                          onClick={toggleMainWalletVisibility}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          aria-label={hideMainWallet ? "Show address" : "Hide address"}
                        >
                          {hideMainWallet ? (
                            <RiEyeLine className="text-lg" />
                          ) : (
                            <RiEyeOffLine className="text-lg" />
                          )}
                        </button>
                      </div>
                      <button 
                        onClick={() => handleCopyToClipboard(merchantData.walletAddress)}
                        className="flex items-center gap-1 text-sm text-[#7042D2] hover:text-purple-700"
                      >
                        <RiFileCopyLine />
                        <span>{copySuccess || 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Solana Wallet */}
                {hasSolWallet && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Solana Wallet (SOL, USDC-SOL)</span>
                      {!hasEthWallet && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Primary</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center max-w-[70%]">
                        <span className="font-mono text-sm truncate">
                          {formatAddress(merchantData.solWalletAddress, hideMainWallet)}
                        </span>
                        <button 
                          onClick={toggleMainWalletVisibility}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          aria-label={hideMainWallet ? "Show address" : "Hide address"}
                        >
                          {hideMainWallet ? (
                            <RiEyeLine className="text-lg" />
                          ) : (
                            <RiEyeOffLine className="text-lg" />
                          )}
                        </button>
                      </div>
                      <button 
                        onClick={() => handleCopyToClipboard(merchantData.solWalletAddress)}
                        className="flex items-center gap-1 text-sm text-[#7042D2] hover:text-purple-700"
                      >
                        <RiFileCopyLine />
                        <span>{copySuccess || 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <RiInformationLine className="mr-1" />
              <span>These wallet addresses will be used as your default payment destination</span>
            </div>
          </div>

          {/* Additional Payment Methods List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-6">Additional Payment Methods</h2>
            
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <RiWallet3Line className="mx-auto text-5xl mb-3 text-gray-400" />
                <p>No additional payment methods added yet.</p>
                <p className="mt-2">Add more payment options to expand your payment capabilities.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                <div className="grid grid-cols-12 font-semibold text-gray-600 pb-4 mb-4">
                  <div className="col-span-3">Type</div>
                  <div className="col-span-4">Name/Bank</div>
                  <div className="col-span-4">Address/Account</div>
                  <div className="col-span-1">Actions</div>
                </div>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="grid grid-cols-12 py-4 items-center">
                    <div className="col-span-3 flex items-center">
                      {method.type === 'crypto' ? (
                        <div className="flex items-center">
                          <RiWallet3Line className="text-[#7042D2] mr-2" />
                          <span>Crypto Wallet</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <RiBankLine className="text-[#7042D2] mr-2" />
                          <span>Bank Account</span>
                        </div>
                      )}
                    </div>
                    <div className="col-span-4">
                      {method.type === 'crypto' ? method.name : method.bankName}
                    </div>
                    <div className="col-span-4 flex items-center">
                      {method.type === 'crypto' ? (
                        <div className="flex items-center">
                          <span className="font-mono truncate max-w-[70%]">
                            {formatAddress(
                              method.address, 
                              hiddenAddresses[method.id]
                            )}
                          </span>
                          <button 
                            onClick={() => toggleAddressVisibility(method.id)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            {hiddenAddresses[method.id] ? (
                              <RiEyeLine className="text-lg" />
                            ) : (
                              <RiEyeOffLine className="text-lg" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span>{method.accountNumber ? `****${method.accountNumber.slice(-4)}` : ''}</span>
                      )}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        onClick={() => handleDelete(method.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete payment method"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Payment Method Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Add Payment Method</h2>
            
            {/* Method Type Selector */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                className={`flex-1 py-2 rounded-md ${
                  methodType === 'crypto'
                    ? 'bg-white shadow-sm text-[#7042D2]'
                    : 'text-gray-600'
                }`}
                onClick={() => setMethodType('crypto')}
              >
                <div className="flex items-center justify-center gap-2">
                  <RiWallet3Line />
                  <span>Crypto Wallet</span>
                </div>
              </button>
              <button
                className={`flex-1 py-2 rounded-md ${
                  methodType === 'bank'
                    ? 'bg-white shadow-sm text-[#7042D2]'
                    : 'text-gray-600'
                }`}
                onClick={() => setMethodType('bank')}
              >
                <div className="flex items-center justify-center gap-2">
                  <RiBankLine />
                  <span>Bank Account</span>
                </div>
              </button>
            </div>
            
            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md flex items-center">
                <RiCheckboxCircleFill className="text-green-500 mr-2" />
                {successMessage}
              </div>
            )}
            
            {/* Error Message */}
            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md flex items-center">
                <RiErrorWarningLine className="text-red-500 mr-2" />
                {formError}
              </div>
            )}
            
            {/* Form */}
            <form onSubmit={handleSubmit}>
              {methodType === 'crypto' ? (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Currency/Wallet Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                      placeholder="e.g., USDT, USDC, Bitcoin, Ethereum"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Wallet Address*
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                      placeholder="0x..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Bank Name*
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Account Number*
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Account Name*
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                      placeholder="Enter account name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Routing Number (optional)
                    </label>
                    <input
                      type="text"
                      name="routingNumber"
                      value={formData.routingNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                      placeholder="Enter routing number"
                    />
                  </div>
                </>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Wallet Addresses Modal */}
      {editWalletModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setEditWalletModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Update Wallet Addresses</h2>
            
            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md flex items-center">
                <RiCheckboxCircleFill className="text-green-500 mr-2" />
                {successMessage}
              </div>
            )}
            
            {/* Error Message */}
            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md flex items-center">
                <RiErrorWarningLine className="text-red-500 mr-2" />
                {formError}
              </div>
            )}
            
            {/* Info Message */}
            <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md flex items-start">
              <RiInformationLine className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <span>These wallet addresses will be used as your default payment destinations for your customers.</span>
            </div>
            
            {/* Form */}
            <form onSubmit={handleUpdateWallet}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  EVM Wallet Address* (ETH, USDT, USDC)
                </label>
                <input
                  type="text"
                  name="walletAddress"
                  value={walletFormData.walletAddress}
                  onChange={handleWalletChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                  placeholder="0x..."
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Solana Wallet Address (optional)
                </label>
                <input
                  type="text"
                  name="solWalletAddress"
                  value={walletFormData.solWalletAddress}
                  onChange={handleWalletChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                  placeholder="Solana address..."
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditWalletModalOpen(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-[#7042D2] text-white rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Wallets'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;