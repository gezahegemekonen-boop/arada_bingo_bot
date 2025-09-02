// commands/player/deposit.js
const { User } = require('../../models/User'); // adjust path as needed
const { Transaction } = require('../../models/Transaction'); // adjust path as needed

module.exports = (bot) => {
  bot.onText(/\/deposit(?:\s+(\d+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const amount = parseInt(match[1]);

    if (!amount || amount < 10) {
      return bot.sendMessage(chatId, '💵 Please enter a valid amount (minimum 10 ETB). Example: /deposit 50');
    }

    let user = await User.findOne({ telegramId: userId });
    if (!user) {
      user = new User({ telegramId: userId });
    }

    // Save location if not already saved
    if (!user.location) {
      user.location = 'Burayu, Oromia Region, Ethiopia';
    }

    // Create pending transaction
    const tx = new Transaction({
      telegramId: userId,
      amount,
      status: 'pending',
      method: 'Telebirr',
      createdAt: new Date(),
    });

    await tx.save();

    bot.sendMessage(chatId, `
📥 Deposit request received!

💵 Amount: ${amount} ETB  
📍 Location: ${user.location}  
⏳ Status: Pending approval  
📲 Method: Telebirr

✅ You’ll be notified once approved. Type /balance to check your wallet.
`);

    // 🎁 Referral bonus logic
    if (user.referredBy && !user.referralBonusGiven) {
      const referrer = await User.findOne({ telegramId: user.referredBy });
      if (referrer) {
        referrer.coins += 10;
        await referrer.save();

        user.referralBonusGiven = true;
        await user.save();

        bot.sendMessage(referrer.telegramId, `🎉 Your friend just deposited! You earned 10 bonus coins.`);
      }
    }

    await user.save();
  });
};
