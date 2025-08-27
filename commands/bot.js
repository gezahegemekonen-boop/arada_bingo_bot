const Transaction = require('../models/Transaction');
const User = require('../models/User');
const checkIfAdmin = require('../utils/checkIfAdmin');

module.exports = (bot) => {
  bot.command('reject', async (ctx) => {
    const isAdmin = checkIfAdmin(ctx.from.id);
    if (!isAdmin) return ctx.reply('🚫 You are not authorized.');

    const txId = ctx.message.text.split(' ')[1];
    if (!txId) return ctx.reply('❗ Please provide a transaction ID.');

    const tx = await Transaction.findById(txId);
    if (!tx || tx.status !== 'pending') {
      return ctx.reply('⚠️ Transaction not found or already processed.');
    }

    tx.status = 'rejected';
    await tx.save();

    const user = await User.findById(tx.userId);
    await ctx.telegram.sendMessage(user.telegramId, `❌ Your transaction (${tx.type} ${tx.amount}) was rejected by admin.`);

    ctx.reply(`✅ Transaction ${txId} rejected.`);
  });
};
