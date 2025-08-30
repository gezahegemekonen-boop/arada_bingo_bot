const User = require('../../models/User');

module.exports = function(bot) {
  bot.onText(/\/referrals/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const user = await User.findOne({ telegramId });
    if (!user) {
      return bot.sendMessage(chatId, '🙈 Player not found.');
    }

    const lang = user.language || 'en';

    // Find users who were referred by this player
    const referrals = await User.find({ referredBy: telegramId });

    const totalReferrals = referrals.length;
    const rewarded = referrals.filter(r => r.referralBonusGiven).length;
    const pending = totalReferrals - rewarded;

    const message = lang === 'am'
      ? `👥 የተጋበዙ ጓደኞች፦ ${totalReferrals}\n🎁 የተሰጠ እንደ እነዚህ ኮይኖች፦ ${rewarded * 10}\n⏳ በመጠባበቅ ላይ፦ ${pending}`
      : `👥 Total referrals: ${totalReferrals}\n🎁 Coins earned: ${rewarded * 10}\n⏳ Pending referrals: ${pending}`;

    bot.sendMessage(chatId, message);
  });
};
