import React, { useEffect, useState } from 'react';
import { getBalance, getTransactions, getReferrals } from '../api/api';
import Balance from './Balance';
import Transactions from './Transactions';
import Referrals from './Referrals';

const Dashboard = ({ telegramId }) => {
  const [balance, setBalance] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setBalance(await getBalance(telegramId));
      setTransactions(await getTransactions(telegramId));
      setReferrals(await getReferrals(telegramId));
    };
    fetchData();
  }, [telegramId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bingo Dashboard</h1>
      <Balance balance={balance} />
      <Transactions transactions={transactions} />
      <Referrals referrals={referrals} />
    </div>
  );
};

export default Dashboard;
