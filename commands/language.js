const Player = require('../models/Player');

module.exports = (bot) => {
  bot.command('language', async (ctx) => {
    const telegramId = ctx.from.id.toString();
    const player = await Player.findOne({ telegramId });

    if (!player) return ctx.reply('❌ You are not registered.');

    const newLang = player.language === 'en' ? 'am' : 'en';
    player.language = newLang;
    await player.save();

    const message = newLang === 'am'
      ? '✅ ቋንቋ ወደ አማርኛ ተቀየረ።'
      : '✅ Language switched to English.';
      
    ctx.reply(message);
  });
};
