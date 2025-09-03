const Transaction = require('../../models/Transaction');

module.exports = function(bot) {
  bot.onText(/\/pending/, async (msg) => {
    const adminId = msg.from.id.toString();
    if (adminId !== process.env.ADMIN_ID) {
      return bot.sendMessage(msg.chat.id, '❌ Unauthorized.');
    }

    const pendingTxs = await Transaction.find({ approved: false });
    if (pendingTxs.length === 0) {
      return bot.sendMessage(adminId, '✅ No pending transactions.');
    }

    let message = '🧾 *Pending Transactions:*\n\n';
    pendingTxs.forEach(tx => {
      message += `🆔 ${tx._id}\n👤 Player: ${tx.playerId}\n💸 Type: ${tx.type}\n💰 Amount: ${tx.amount} birr\n🕒 ${tx.createdAt.toLocaleString()}\n\n`;
    });

    bot.sendMessage(adminId, message, { parse_mode: 'Markdown' });
  });
};
