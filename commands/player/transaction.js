const Transaction = require('../../models/Transaction');

module.exports = function(bot) {
  bot.onText(/\/transaction/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const lang = msg.from.language_code || 'en';

    const transactions = await Transaction.find({ playerId: telegramId }).sort({ createdAt: -1 }).limit(10);

    if (!transactions.length) {
      const noTx = lang.startsWith('am')
        ? '🚫 ምንም ንብረት ታሪክ አልተገኘም።'
        : '🚫 No transaction history found.';
      return bot.sendMessage(chatId, noTx);
    }

    let message = lang.startsWith('am') ? '📄 የንብረት ታሪክ፦\n\n' : '📄 Transaction History:\n\n';

    transactions.forEach(tx => {
      const type = tx.type === 'deposit'
        ? (lang.startsWith('am') ? 'አከል' : 'Deposit')
        : (lang.startsWith('am') ? 'መውጣት' : 'Withdraw');
      const status = tx.approved
        ? (lang.startsWith('am') ? '✔ ተፈቀደ' : '✔ Approved')
        : (lang.startsWith('am') ? '⏳ በመጠባበቅ ላይ' : '⏳ Pending');
      message += `• ${type}: ${tx.amount} birr — ${status}\n`;
    });

    bot.sendMessage(chatId, message);
  });
};
