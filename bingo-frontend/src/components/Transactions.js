import React from 'react';

const Transactions = ({ transactions }) => (
  <div className="mb-4 p-4 border rounded shadow">
    <h2 className="font-bold mb-2">Recent Transactions</h2>
    {transactions.length === 0 ? (
      <p>No transactions found.</p>
    ) : (
      <ul>
        {transactions.map(tx => (
          <li key={tx._id}>
            {tx.type} - {tx.amount} birr - {tx.status}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Transactions;
