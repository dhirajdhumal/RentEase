import { useState } from 'react';
import './PaymentModal.css';

function PaymentModal({ amount, onConfirm, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm(selectedMethod);
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h2>Complete Payment</h2>
        <div className="payment-amount">
          <p>Total Amount</p>
          <h3>₹{amount}</h3>
        </div>

        <div className="payment-methods">
          <label className={selectedMethod === 'upi' ? 'selected' : ''}>
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={selectedMethod === 'upi'}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <span>💳 UPI</span>
          </label>

          <label className={selectedMethod === 'card' ? 'selected' : ''}>
            <input
              type="radio"
              name="payment"
              value="card"
              checked={selectedMethod === 'card'}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <span>💳 Credit/Debit Card</span>
          </label>

          <label className={selectedMethod === 'netbanking' ? 'selected' : ''}>
            <input
              type="radio"
              name="payment"
              value="netbanking"
              checked={selectedMethod === 'netbanking'}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <span>🏦 Net Banking</span>
          </label>

          <label className={selectedMethod === 'wallet' ? 'selected' : ''}>
            <input
              type="radio"
              name="payment"
              value="wallet"
              checked={selectedMethod === 'wallet'}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <span>👛 Wallet</span>
          </label>
        </div>

        <div className="payment-actions">
          <button onClick={onCancel} className="btn-secondary" disabled={processing}>
            Cancel
          </button>
          <button onClick={handlePayment} className="btn-primary" disabled={processing}>
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>

        <p className="payment-note">
          🔒 This is a demo payment. No actual transaction will occur.
        </p>
      </div>
    </div>
  );
}

export default PaymentModal;
