const User = require('../../models/User');
const Transaction = require('../../models/Transaction');

module.exports = (bot) => {
  bot.onText(/\/deposit (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const amount = parseInt(match[1]);

    if (!amount || amount < 10) return bot.sendMessage(chatId, 'Minimum deposit: 10 ETB.');

    let user = await User.findOne({ telegramId: userId });
    if (!user) {
      user = new User({ telegramId: userId });
      await user.save();
    }

    const tx = new Transaction({
      telegramId: userId,
      amount,
      status: 'pending',
      method: 'Telebirr',
      createdAt: new Date(),
    });

    await tx.save();
    bot.sendMessage(chatId, `📥 Deposit request for ${amount} ETB received. Pending approval.`);
  });
};
