const Transaction = require('../models/Transaction');
const User = require('../models/User');
const checkIfAdmin = require('../utils/checkIfAdmin');

module.exports = (bot) => {
  bot.command('pending', async (ctx) => {
    const isAdmin = checkIfAdmin(ctx.from.id);
    if (!isAdmin) return ctx.reply('🚫 You are not authorized.');

    const pendingTxs = await Transaction.find({ status: 'pending' });

    if (pendingTxs.length === 0) {
      return ctx.reply('📭 No pending transactions.');
    }

    let message = '🕒 Pending Transactions:\n\n';
    for (const tx of pendingTxs) {
      const user = await User.findById(tx.userId);
      message += `🆔 ${tx._id}\n👤 ${user?.username || user?.telegramId}\n💰 ${tx.type} ${tx.amount} ETB\n\n`;
    }

    ctx.reply(message.trim());
  });
};
