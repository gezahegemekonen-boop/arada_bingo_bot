module.exports = function(bot) {
  bot.onText(/\/balance/, async (msg) => {
    const telegramId = msg.from.id.toString();
    const player = await Player.findOne({ telegramId });

    if (!player) {
      return bot.sendMessage(telegramId, '❌ Player not found.');
    }

    const reply = player.language === 'am'
      ? `💵 የእርስዎ ቀሪ በላንስ ነው፡፡ ${player.balance} ብር`
      : `💵 Your current balance is: ${player.balance} birr`;

    bot.sendMessage(telegramId, reply);
  });
};
