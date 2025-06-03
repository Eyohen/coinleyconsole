// DirectCoinleyCheckout.jsx - Add this file to your e-commerce project
import React, { useState, useRef, useEffect } from 'react';
import {QRCodeSVG} from 'qrcode.react';

// This component completely bypasses the SDK build issues
const DirectCoinleyCheckout = ({
  apiKey,
  apiSecret,
  apiUrl = 'https://coinleyserver-production.up.railway.app',
  customerEmail,
  merchantName = 'Merchant',
  onSuccess,
  onError,
  onClose,
  buttonText = 'Pay with Crypto',
  buttonClassName = 'bg-blue-600 text-white py-2 px-4 rounded',
  amount,
  orderId,
  theme = 'light'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('initial'); // initial, currency, payment, success, error
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // wallet or qrcode
  
  // Create payment when button is clicked
  const handleCreatePayment = async () => {
    if (!amount) {
      setError("Amount is required");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/api/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'x-api-secret': apiSecret
        },
        body: JSON.stringify({
          amount,
          currency: selectedCurrency,
          customerEmail,
          metadata: { orderId }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Payment creation failed: ${response.status}`);
      }
      
      const data = await response.json();
      setPaymentData(data.payment);
      setIsOpen(true);
      setStep('currency');
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to create payment');
      setLoading(false);
      if (onError) onError(err);
    }
  };
  
  // Handle currency selection
  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setStep('payment');
  };
  
  // Handle payment completion
  const handlePaymentComplete = () => {
    // Generate a fake transaction hash for demo
    const txHash = `direct_${Date.now().toString(16)}`;
    setStep('success');
    
    // Call success callback
    if (onSuccess && paymentData) {
      onSuccess(paymentData.id, txHash);
    }
  };
  
  // Close modal
  const handleClose = () => {
    setIsOpen(false);
    setStep('initial');
    setPaymentData(null);
    if (onClose) onClose();
  };
  
  // PAYMENT METHODS COMPONENT
  const PaymentMethods = () => {
    const currencies = [
      { id: 'USDT', name: 'USDT', description: 'Tether USD' },
      { id: 'USDC', name: 'USDC', description: 'USD Coin' },
      { id: 'BNB', name: 'BNB', description: 'Binance Coin' },
      { id: 'SOL', name: 'SOL', description: 'Solana' }
    ];
    
    return (
      <div>
        <h3 className="text-lg font-medium mb-3">Select Payment Method</h3>
        <div className="space-y-2">
          {currencies.map(currency => (
            <button
              key={currency.id}
              onClick={() => handleCurrencySelect(currency.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                selectedCurrency === currency.id 
                  ? 'bg-blue-50 border border-blue-500' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex-1 text-left">
                <h4 className="font-medium">{currency.name}</h4>
                <p className="text-sm text-gray-500">{currency.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };
  
 

// Then replace the existing QRCode component with this:
const QRCode = () => {
    // Generate payment URI for QR code
    const getPaymentUri = () => {
      const scheme = selectedCurrency === 'SOL' ? 'solana' : 'ethereum';
      const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'; // Use your actual address
      return `${scheme}:${address}?amount=${paymentData?.amount || amount}&currency=${selectedCurrency}`;
    };
  
    return (
      <div className="flex flex-col items-center">
        <div className="p-4 rounded-lg bg-white mb-3">
          {/* Real QR code */}
          <QRCodeSVG
            value={getPaymentUri()}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="L"
            includeMargin={false}
          />
        </div>
        
        <div className="text-center text-sm text-gray-700">
          Scan with your wallet app to pay
        </div>
        
        <div className="mt-3 w-full">
          <p className="text-xs text-gray-500 mb-1">
            Send {paymentData?.amount || amount} {selectedCurrency} to:
          </p>
          <div className="text-xs font-mono p-2 rounded overflow-auto break-all bg-gray-100 text-gray-700">
            0x742d35Cc6634C0532925a3b844Bc454e4438f44e
          </div>
        </div>
        
        <div className="mt-4 w-full">
          <div className="p-3 rounded bg-gray-100">
            <h4 className="text-sm font-medium mb-2 text-gray-800">
              Payment Instructions
            </h4>
            <ol className="text-xs space-y-2 text-gray-600">
              <li>1. Open your crypto wallet app</li>
              <li>2. Scan the QR code above</li>
              <li>3. Send {paymentData?.amount || amount} {selectedCurrency}</li>
              <li>4. Click "Pay Now" button after sending</li>
            </ol>
          </div>
        </div>
      </div>
    );
  };

  
  // PAYMENT COMPONENT
  const PaymentConfirmation = () => {
    return (
      <div>
        <div className="p-4 rounded-lg mb-4 bg-gray-100">
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Payment Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Currency:</span>
              <span className="font-medium">{selectedCurrency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-medium">
                {selectedCurrency === 'SOL' ? 'Solana' : 'Ethereum'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${paymentData?.amount || amount}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div className="mb-4">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setPaymentMethod('wallet')}
              className={`py-2 px-4 text-sm font-medium ${
                paymentMethod === 'wallet' 
                  ? 'bg-gray-100 text-gray-800 rounded-t-md' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Connect Wallet
            </button>
            <button
              onClick={() => setPaymentMethod('qrcode')}
              className={`py-2 px-4 text-sm font-medium ${
                paymentMethod === 'qrcode' 
                  ? 'bg-gray-100 text-gray-800 rounded-t-md' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              QR Code
            </button>
          </div>
        </div>

        {paymentMethod === 'qrcode' ? (
          <div className="p-4 rounded-lg mb-4 bg-blue-50">
            <QRCode />
          </div>
        ) : (
          <div className="p-4 rounded-lg mb-4 bg-blue-50">
            <div className="flex items-center">
              <img 
                src="https://metamask.io/images/metamask-fox.svg" 
                alt="MetaMask" 
                className="w-8 h-8 mr-2"
              />
              <div>
                <h3 className="font-medium text-gray-800">
                  Pay with MetaMask
                </h3>
                <p className="text-sm text-gray-600">
                  Click 'Connect Wallet' to proceed with payment
                </p>
              </div>
            </div>
            <button
              className="mt-3 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md"
            >
              Connect Wallet
            </button>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStep('currency')}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handlePaymentComplete}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md"
          >
            Pay Now
          </button>
        </div>
      </div>
    );
  };
  
  // SUCCESS COMPONENT
  const PaymentSuccess = () => {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="mb-4">
          <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">
          Payment Successful!
        </h3>
        <p className="text-center text-green-600">
          Your payment has been processed successfully.
        </p>
        <div className="mt-4 p-2 rounded bg-gray-100 w-full">
          <p className="text-xs text-gray-600">
            Your payment has been successfully processed. You will receive a confirmation shortly.
          </p>
        </div>
        <button
          onClick={handleClose}
          className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Close
        </button>
      </div>
    );
  };
  
  // MODAL
  const Modal = () => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative p-6 w-full max-w-md mx-auto rounded-lg shadow-xl bg-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-900">Coinley Pay</h2>
              </div>
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="mb-6">
              {paymentData && (
                <div className="mb-6 p-4 rounded-lg bg-gray-100">
                  <p className="text-sm text-gray-600">
                    {merchantName}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-gray-700">
                      Amount:
                    </span>
                    <span className="font-bold text-xl">
                      ${Number(paymentData.amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs mt-1 text-right">
                    <span className="text-gray-500">
                      Payment ID: {paymentData.id?.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              )}

              {step === 'currency' && <PaymentMethods />}
              {step === 'payment' && <PaymentConfirmation />}
              {step === 'success' && <PaymentSuccess />}
              {step === 'error' && (
                <div className="p-4 bg-red-50 rounded-md text-red-700">
                  {error || "An error occurred while processing your payment."}
                  <button
                    className="mt-3 w-full py-2 px-4 bg-blue-500 text-white rounded-md"
                    onClick={() => setStep('currency')}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500">
              <p>Powered by Coinley - Secure Cryptocurrency Payments</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <button 
        className={buttonClassName}
        onClick={handleCreatePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : buttonText}
      </button>
      
      <Modal />
    </>
  );
};

export default DirectCoinleyCheckout;