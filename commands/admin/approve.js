const { getRoomByPlayerId } = require('../utils/roomManager');
const checkIfAdmin = require('../utils/checkIfAdmin');
const Player = require('../models/Player'); // Make sure this path is correct

module.exports = (bot) => {
  // ✅ Approve Command
  bot.command('approve', async (ctx) => {
    const adminId = ctx.from.id.toString();
    const isAdmin = checkIfAdmin(adminId);
    if (!isAdmin) return ctx.reply('🚫 You are not authorized.');

    const args = ctx.message.text.split(' ');
    const targetId = args[1];
    if (!targetId) return ctx.reply('ℹ️ Usage: /approve <playerId>');

    const room = getRoomByPlayerId(targetId);
    if (!room) return ctx.reply('❌ Player not found in any room.');

    const player = room.players.find(p => p.telegramId === targetId);
    if (!player || !player.hasWon) {
      return ctx.reply('⚠️ Player has not claimed Bingo.');
    }

    player.isApproved = true;

    await ctx.telegram.sendMessage(targetId, '✅ Your Bingo win has been approved!');
    ctx.reply(`🎉 Approved Bingo for ${player.username}`);
  });

  // 📊 Stats Command
  bot.command('stats', async (ctx) => {
    const adminId = ctx.from.id.toString();
    const isAdmin = checkIfAdmin(adminId);
    if (!isAdmin) return ctx.reply('🚫 You are not authorized.');

    const stats = await Player.aggregate([
      {
        $group: {
          _id: null,
          totalGames: { $sum: "$totalGamesPlayed" },
          totalWins: { $sum: "$totalWins" },
          totalPayouts: { $sum: "$totalPayouts" }
        }
      }
    ]);

    const s = stats[0] || { totalGames: 0, totalWins: 0, totalPayouts: 0 };
    ctx.reply(`📊 Game Stats:\nGames Played: ${s.totalGames}\nWins: ${s.totalWins}\nPayouts: ${s.totalPayouts} birr`);
  });
};
