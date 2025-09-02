// commands/admin/reject.js

const Transaction = require('../../models/Transaction');
const Player = require('../../models/Player');

module.exports = (bot) => {
  bot.onText(/\/reject (\w+)/, async (msg, match) => {
    const adminId = msg.from.id.toString();

    if (adminId !== process.env.ADMIN_ID) {
      return bot.sendMessage(msg.chat.id, '❌ Unauthorized.');
    }

    if (!match || !match[1]) {
      return bot.sendMessage(adminId, '⚠️ Usage: /reject <transactionId>');
    }

    const txId = match[1];

    try {
      const transaction = await Transaction.findById(txId);

      if (!transaction || transaction.type !== 'withdraw') {
        return bot.sendMessage(adminId, '❌ Transaction not found or not a withdrawal.');
      }

      if (transaction.rejected === true) {
        return bot.sendMessage(adminId, '⚠️ This transaction has already been rejected.');
      }

      transaction.rejected = true;
      transaction.approved = false;
      await transaction.save();

      const player = await Player.findOne({ telegramId: transaction.playerId });

      const reply = player?.language === 'am'
        ? '❌ የመውጣት ጥያቄዎ ተቀባይነት አላገኘም። እባክዎ እንደገና ይሞክሩ።'
        : '❌ Your withdrawal request was rejected. Please try again later.';

      await bot.sendMessage(transaction.playerId, reply);
      await bot.sendMessage(adminId, `✅ Transaction ${txId} rejected and user notified.`);
    } catch (err) {
      console.error('❌ Error in /reject:', err);
      await bot.sendMessage(adminId, '⚠️ Something went wrong while rejecting the transaction.');
    }
  });
};


