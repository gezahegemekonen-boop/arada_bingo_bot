const Player = require('../../models/Player');
const Transaction = require('../../models/Transaction');

module.exports = (bot) => {
  bot.onText(/\/stats/, async (msg) => {
    const adminId = msg.from.id.toString();
    if (adminId !== process.env.ADMIN_ID) return bot.sendMessage(adminId, '❌ Unauthorized.');

    const totalPlayers = await Player.countDocuments();
    const totalDeposits = await Transaction.aggregate([
      { $match: { type: 'deposit', approved: true } },
      { $group: { _id: null, sum: { $sum: '$amount' } } }
    ]);

    const totalWithdrawals = await Transaction.aggregate([
      { $match: { type: 'withdraw', approved: true } },
      { $group: { _id: null, sum: { $sum: '$amount' } } }
    ]);

    let message = `📊 Admin Stats:\n\n`;
    message += `👥 Total players: ${totalPlayers}\n`;
    message += `💰 Total deposits approved: ${totalDeposits[0]?.sum || 0} ETB\n`;
    message += `📤 Total withdrawals approved: ${totalWithdrawals[0]?.sum || 0} ETB`;

    bot.sendMessage(adminId, message);
  });
};
