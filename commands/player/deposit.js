// commands/player/deposit.js

const { User } = require('../../models/User');
const { Transaction } = require('../../models/Transaction');

module.exports = function (bot) {
  bot.onText(/\/deposit(?:\s+(\d+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const amount = match && match[1] ? parseInt(match[1]) : 0;

    try {
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

      await bot.sendMessage(chatId, `
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

          await bot.sendMessage(referrer.telegramId, '🎉 Your friend just deposited! You earned 10 bonus coins.');
        }
      }

      await user.save();
    } catch (err) {
      console.error('❌ Error in /deposit:', err);
      await bot.sendMessage(chatId, '⚠️ Something went wrong while processing your deposit.');
    }
  });
};
