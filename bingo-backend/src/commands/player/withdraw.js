const Player = require('../../models/Player');
const Transaction = require('../../models/Transaction');

module.exports = (bot) => {
  bot.onText(/\/withdraw (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const amount = parseInt(match[1]);

    const player = await Player.findOne({ telegramId });
    if (!player || player.wallet < amount) {
      return bot.sendMessage(chatId, '❌ Insufficient balance.');
    }

    await Transaction.create({
      playerId: telegramId,
      type: 'withdraw',
      amount,
      approved: false,
    });

    bot.sendMessage(chatId, '📤 Withdrawal request submitted. Await admin approval.');
  });
};
