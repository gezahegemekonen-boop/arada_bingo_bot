// commands/player/bonus.js

const User = require('../../models/User');

module.exports = function (bot) {
  bot.onText(/\/bonus/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    try {
      const user = await User.findOne({ telegramId });
      if (!user) return await bot.sendMessage(chatId, '🙈 Player not found.');

      const now = new Date();
      const lastBonus = user.lastBonusClaim || new Date(0);
      const hoursSince = (now - lastBonus) / (1000 * 60 * 60);

      if (hoursSince < 24) {
        const remaining = (24 - hoursSince).toFixed(1);
        const msgText = user.language === 'am'
          ? `⏳ ቀጣዩን ቦኑስ በ ${remaining} ሰዓት ውስጥ ማግኘት ይችላሉ።`
          : `⏳ You can claim your next bonus in ${remaining} hours.`;
        return await bot.sendMessage(chatId, msgText);
      }

      user.coins += 5;
      user.lastBonusClaim = now;
      await user.save();

      const message = user.language === 'am'
        ? '🎉 ተጨማሪ ኮይኖች ተቀበሉ! (+5)'
        : '🎉 Bonus claimed! You earned +5 coins.';

      await bot.sendMessage(chatId, message);
    } catch (err) {
      console.error('❌ Error in /bonus:', err);
      await bot.sendMessage(chatId, '⚠️ Something went wrong while claiming your bonus.');
    }
  });
};
