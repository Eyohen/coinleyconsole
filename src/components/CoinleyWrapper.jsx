// src/components/CoinleyWrapper.jsx
import React from 'react';
import { ThemeProvider, CoinleyProvider, CoinleyModal } from 'coinley-sdk';

function CoinleyWrapper({ 
  apiKey, 
  apiSecret, 
  apiUrl, 
  customerEmail, 
  merchantName, 
  onSuccess, 
  onClose 
}) {
  return (
    <ThemeProvider initialTheme="light">
      <CoinleyProvider
        apiKey={apiKey}
        apiSecret={apiSecret}
        apiUrl={apiUrl}
        debug={true}
      >
        <div className="coinley-wrapper">
          <CoinleyModal
            onClose={onClose}
            onSuccess={onSuccess}
            customerEmail={customerEmail}
            merchantName={merchantName}
            withThemeToggle={true}
            showClose={true}
          />
        </div>
      </CoinleyProvider>
    </ThemeProvider>
  );
}

export default CoinleyWrapper;