// commands/player/referrals.js

const User = require('../../models/User');

module.exports = function (bot) {
  bot.onText(/\/referrals/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    try {
      const user = await User.findOne({ telegramId });
      if (!user) {
        return bot.sendMessage(chatId, '🙈 Player not found.');
      }

      const lang = user.language || 'en';

      // Find users who were referred by this player
      const referrals = await User.find({ referredBy: telegramId });

      const totalReferrals = referrals.length || 0;
      const rewarded = referrals.filter(r => r.referralBonusGiven).length || 0;
      const pending = totalReferrals - rewarded;

      const message = lang === 'am'
        ? `👥 የተጋበዙ ጓደኞች፦ ${totalReferrals}\n🎁 የተሰጠ ኮይኖች፦ ${rewarded * 10}\n⏳ በመጠባበቅ ላይ፦ ${pending}`
        : `👥 Total referrals: ${totalReferrals}\n🎁 Coins earned: ${rewarded * 10}\n⏳ Pending referrals: ${pending}`;

      await bot.sendMessage(chatId, message);
    } catch (err) {
      console.error('❌ Error in /referrals:', err);
      await bot.sendMessage(chatId, '⚠️ Something went wrong while fetching your referrals.');
    }
  });
};
