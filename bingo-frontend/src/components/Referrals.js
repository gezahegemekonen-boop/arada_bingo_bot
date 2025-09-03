import React from 'react';

const Referrals = ({ referrals }) => (
  <div className="mb-4 p-4 border rounded shadow">
    <h2 className="font-bold mb-2">Referrals</h2>
    <p>Total: {referrals.total}</p>
    <p>Pending: {referrals.pending}</p>
    <p>Coins earned: {referrals.coins}</p>
  </div>
);

export default Referrals;
