// src/components/CoinleyCheckoutWrapper.jsx
import React, { useRef, useEffect } from 'react';
import { ThemeProvider, CoinleyProvider, CoinleyCheckout } from 'coinley-sdk';

function CoinleyCheckoutWrapper({ 
  apiKey, 
  apiSecret, 
  apiUrl, 
  customerEmail, 
  merchantName,
  amount,
  currency = 'USDT',
  onSuccess, 
  onClose,
  onError
}) {
  const checkoutRef = useRef(null);
  
  useEffect(() => {
    // Open the checkout when component mounts
    if (checkoutRef.current) {
      setTimeout(() => {
        try {
          checkoutRef.current.open({
            amount,
            currency,
            customerEmail
          });
        } catch (err) {
          console.error("Error opening Coinley checkout:", err);
          if (onError) onError(err);
        }
      }, 500); // Small delay to ensure component is fully mounted
    }
  }, [checkoutRef, amount, currency, customerEmail]);

  return (
    <ThemeProvider initialTheme="light">
      <CoinleyProvider
        apiKey={apiKey}
        apiSecret={apiSecret}
        apiUrl={apiUrl}
        debug={true}
      >
        <CoinleyCheckout
          ref={checkoutRef}
          apiKey={apiKey}
          apiSecret={apiSecret}
          customerEmail={customerEmail}
          merchantName={merchantName}
          onSuccess={onSuccess}
          onError={onError}
          onClose={onClose}
          theme="light"
          autoOpen={false} // We'll manage opening ourselves
        />
      </CoinleyProvider>
    </ThemeProvider>
  );
}

export default CoinleyCheckoutWrapper;