const User = require('../models/User');

module.exports = (bot) => {
  bot.command('leaderboard', async (ctx) => {
    const topPlayers = await User.find().sort({ balance: -1 }).limit(5);
    const lines = topPlayers.map((p, i) => `${i + 1}. ${p.name || p.telegramId} - 💰 ${p.balance}`);
    ctx.reply(`🏆 Top Players:\n\n${lines.join('\n')}`);
  });
};
