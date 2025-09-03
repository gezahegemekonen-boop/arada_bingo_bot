const Player = require('../../models/Player');

module.exports = function(bot) {
  bot.onText(/\/balance/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const player = await Player.findOne({ telegramId });
    if (!player) return bot.sendMessage(chatId, '🙈 Player not found.');

    bot.sendMessage(chatId, `💰 Wallet: ${player.wallet} birr\n🎯 Coins: ${player.coins}`);
  });
};
