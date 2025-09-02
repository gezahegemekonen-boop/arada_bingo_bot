// commands/admin/pending.js

const Transaction = require('../../models/Transaction');

module.exports = function (bot) {
  bot.onText(/\/pending/, async (msg) => {
    const adminId = msg.from.id.toString();

    if (adminId !== process.env.ADMIN_ID) {
      return bot.sendMessage(msg.chat.id, '❌ Unauthorized.');
    }

    try {
      const pendingTxs = await Transaction.find({ approved: false });

      if (pendingTxs.length === 0) {
        return bot.sendMessage(adminId, '✅ No pending transactions.');
      }

      let message = '🧾 *Pending Transactions:*\n\n';

      for (const tx of pendingTxs) {
        const line = `🆔 ${tx._id}\n👤 Player: ${tx.playerId}\n💸 Type: ${tx.type}\n💰 Amount: ${tx.amount} birr\n🕒 ${tx.createdAt.toLocaleString()}\n\n`;

        // Prevent exceeding Telegram message limit
        if ((message + line).length > 4000) {
          await bot.sendMessage(adminId, message, { parse_mode: 'Markdown' });
          message = '';
        }

        message += line;
      }

      if (message.trim()) {
        await bot.sendMessage(adminId, message, { parse_mode: 'Markdown' });
      }
    } catch (err) {
      console.error('❌ Error fetching pending transactions:', err);
      await bot.sendMessage(adminId, '⚠️ Failed to fetch pending transactions.');
    }
  });
};
