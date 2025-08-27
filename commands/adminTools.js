const Transaction = require('../models/Transaction');
const User = require('../models/User');
const checkIfAdmin = require('../utils/checkIfAdmin');

module.exports = (bot) => {
  // 🔴 /reject <txId>
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

  // 🟢 /leaderboard
  bot.command('leaderboard', async (ctx) => {
    const topPlayers = await User.find().sort({ balance: -1 }).limit(5);
    const lines = topPlayers.map((p, i) => `${i + 1}. ${p.name || p.telegramId} - 💰 ${p.balance}`);
    ctx.reply(`🏆 Top Players:\n\n${lines.join('\n')}`);
  });
};
