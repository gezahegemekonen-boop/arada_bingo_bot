const Transaction = require('../../models/Transaction');

module.exports = (bot) => {
  bot.onText(/\/transaction/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const txs = await Transaction.find({ playerId: telegramId }).sort({ createdAt: -1 }).limit(10);
    if (!txs.length) return bot.sendMessage(chatId, '🚫 No transaction history.');

    let message = '📄 Transaction History:\n';
    txs.forEach(tx => {
      const status = tx.approved ? '✔ Approved' : '⏳ Pending';
      message += `• ${tx.type}: ${tx.amount} birr — ${status}\n`;
    });

    bot.sendMessage(chatId, message);
  });
};
