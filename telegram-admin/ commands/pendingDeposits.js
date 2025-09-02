import api from '../services/apiClient.js';

export default async function handlePendingDeposits(bot, chatId) {
  try {
    const res = await api.get('/pending-deposits');
    const { transactions } = res.data;

    if (transactions.length === 0) {
      return bot.sendMessage(chatId, '✅ No pending deposits.');
    }

    for (const tx of transactions) {
      const msg = `💰 Deposit\nUser: ${tx.userId}\nAmount: ${tx.amount}\nID: ${tx._id}`;
      bot.sendMessage(chatId, msg, {
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ Approve', callback_data: `approve_tx_${tx._id}` },
            { text: '❌ Reject', callback_data: `reject_tx_${tx._id}` }
          ]]
        }
      });
    }
  } catch (err) {
    console.error('❌ Error fetching deposits:', err.message);
    bot.sendMessage(chatId, '❌ Failed to fetch pending deposits.');
  }
}

