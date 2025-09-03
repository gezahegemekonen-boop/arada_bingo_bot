const Player = require('../../models/Player');
const Transaction = require('../../models/Transaction');

module.exports = function(bot) {
  bot.onText(/\/withdraw (\d+)/, async (msg, match) => {
    const amount = parseInt(match[1]);
    const telegramId = msg.from.id.toString();

    const player = await Player.findOne({ telegramId });
    if (!player || player.wallet < amount) {
      return bot.sendMessage(telegramId, '❌ Insufficient balance.');
    }

    await Transaction.create({
      type: 'withdraw',
      amount,
      playerId: telegramId,
      approved: false
    });

    bot.sendMessage(telegramId, '📤 Withdrawal request submitted. Waiting for admin approval.');
  });
};
