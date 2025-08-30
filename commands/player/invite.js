const { User } = require('../../models/User'); // adjust path as needed

module.exports = function(bot) {
  bot.onText(/\/invite/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Save referral ID if not already saved
    let user = await User.findOne({ telegramId: userId });
    if (!user) {
      user = new User({ telegramId: userId });
      await user.save();
    }

    const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${userId}`;

    const message = `
🎉 Invite friends and earn coins!

🔗 Your referral link: [Click to share](${referralLink})

💰 You’ll get bonus coins when your friend joins and deposits.

*How it works:*  
1. Share your link  
2. They join and deposit  
3. You get rewarded automatically!

Let’s grow the Bingo community 🇪🇹
`;

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });
};
