// src/components/DepositForm.js
import { useState } from 'react';
import { deposit, getBalance } from '../api';

export default function DepositForm({ userId, onBalanceUpdate }) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleDeposit = async () => {
    const birr = parseFloat(amount);
    if (!birr || birr <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    const res = await deposit(userId, birr);
    if (res.success) {
      setMessage('✅ Deposit successful');
      const updated = await getBalance(userId);
      onBalanceUpdate(updated.balance); // update parent balance
      setAmount('');
    } else {
      setMessage(res.message || 'Deposit failed');
    }
  };

  return (
    <div className="deposit-box">
      <h3>💳 በብር ተከፍሉ</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handleDeposit}>Deposit</button>
      {message && <p>{message}</p>}
    </div>
  );
}

