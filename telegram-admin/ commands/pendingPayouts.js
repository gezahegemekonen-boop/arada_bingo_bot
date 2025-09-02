import api from '../services/apiClient.js';

export default async function handlePendingPayouts(bot, chatId) {
  try {
    const res = await api.get('/pending-payouts');
    const { rounds } = res.data;

    if (rounds.length === 0) {
      return bot.sendMessage(chatId, '✅ No pending payouts.');
    }

    for (const round of rounds) {
      const msg = `🎯 Payout\nUser: ${round.userId}\nWin: ${round.winType}\nAmount: ${round.payoutAmount}\nRound ID: ${round.roundId}`;
      bot.sendMessage(chatId, msg, {
        reply_markup: {
          inline_keyboard: [[
            { text: '💰 Approve Payout', callback_data: `approve_round_${round.roundId}` }
          ]]
        }
      });
    }
  } catch (err) {
    console.error('❌ Error fetching payouts:', err.message);
    bot.sendMessage(chatId, '❌ Failed to fetch pending payouts.');
  }
}

