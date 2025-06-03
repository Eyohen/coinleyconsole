import React, { useState } from 'react';
import { CoinleyModal } from 'coinley-checkout';

function DirectModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <CoinleyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        payment={{ id: 'test-123', amount: 10.99, totalAmount: 11.15 }}
        paymentStatus="idle"
        selectedCurrency="USDT"
        onCurrencySelect={(c) => console.log('Currency selected:', c)}
        onPayment={() => console.log('Payment confirmed')}
        theme="light"
        merchantName="Test Merchant"
        testMode={false}
      />
    </div>
  );
}

export default DirectModal