const Transaction = require('../../models/Transaction');
const Player = require('../../models/Player');

module.exports = (bot) => {
  bot.onText(/\/approve (\w+)/, async (msg, match) => {
    const adminId = msg.from.id.toString();
    if (adminId !== process.env.ADMIN_ID) return bot.sendMessage(adminId, '❌ Unauthorized.');

    const txId = match[1];
    try {
      const tx = await Transaction.findById(txId);
      if (!tx) return bot.sendMessage(adminId, '❌ Transaction not found.');

      tx.approved = true;
      tx.rejected = false;
      await tx.save();

      // Update player balance if deposit
      if (tx.type === 'deposit') {
        const player = await Player.findOne({ telegramId: tx.playerId });
        if (player) {
          player.wallet += tx.amount;
          await player.save();
          bot.sendMessage(tx.playerId, `✅ Your deposit of ${tx.amount} ETB has been approved!`);
        }
      } else if (tx.type === 'withdraw') {
        const player = await Player.findOne({ telegramId: tx.playerId });
        if (player) {
          player.wallet -= tx.amount;
          await player.save();
          bot.sendMessage(tx.playerId, `✅ Your withdrawal of ${tx.amount} ETB has been approved!`);
        }
      }

      bot.sendMessage(adminId, `✅ Transaction ${txId} approved.`);
    } catch (err) {
      console.error(err);
      bot.sendMessage(adminId, '⚠️ Something went wrong.');
    }
  });
};
