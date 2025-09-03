import React from 'react';

const Balance = ({ balance }) => (
  <div className="mb-4 p-4 border rounded shadow">
    <h2 className="font-bold mb-2">Wallet & Coins</h2>
    <p>Wallet: {balance.wallet} birr</p>
    <p>Coins: {balance.coins}</p>
  </div>
);

export default Balance;
