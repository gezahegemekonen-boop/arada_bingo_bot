const User = require('../../models/User');
const Transaction = require('../../models/Transaction');

module.exports = function(bot) {
  bot.onText(/\/deposit(?:\s+(\d+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    const amount = parseInt(match[1]);

    if (!amount || amount < 10) {
      return bot.sendMessage(chatId, '💵 Please enter a valid amount (minimum 10 ETB). Example: /deposit 50');
    }

    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({ telegramId });
    }

    // Save location if missing
    if (!user.location) user.location = 'Burayu, Oromia Region, Ethiopia';

    // Create deposit transaction
    const tx = new Transaction({
      telegramId,
      amount,
      status: 'pending',
      method: 'Telebirr',
      createdAt: new Date()
    });

    await tx.save();
    await user.save();

    bot.sendMessage(chatId, `📥 Deposit request received!\n💵 Amount: ${amount} ETB\n📍 Location: ${user.location}\n⏳ Status: Pending approval`);
  });
};
