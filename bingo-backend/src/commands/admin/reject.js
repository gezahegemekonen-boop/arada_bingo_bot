const Transaction = require('../../models/Transaction');
const Player = require('../../models/Player');

module.exports = (bot) => {
  bot.onText(/\/reject (\w+)/, async (msg, match) => {
    const adminId = msg.from.id.toString();
    if (adminId !== process.env.ADMIN_ID) return bot.sendMessage(adminId, '❌ Unauthorized.');

    const txId = match[1];
    try {
      const tx = await Transaction.findById(txId);
      if (!tx) return bot.sendMessage(adminId, '❌ Transaction not found.');

      tx.rejected = true;
      tx.approved = false;
      await tx.save();

      bot.sendMessage(tx.playerId, '❌ Your transaction was rejected.');
      bot.sendMessage(adminId, `✅ Transaction ${txId} rejected.`);
    } catch (err) {
      console.error(err);
      bot.sendMessage(adminId, '⚠️ Something went wrong.');
    }
  });
};
