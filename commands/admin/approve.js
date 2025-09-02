const { getRoomByPlayerId } = require('../../utils/roomManager'); // ✅ Corrected path
const checkIfAdmin = require('../../utils/checkIfAdmin');         // ✅ Corrected path
const Player = require('../../models/Player');                    // ✅ Confirm this path matches your structure

module.exports = (bot) => {
  // ✅ Approve Command
  bot.command('approve', async (ctx) => {
    const adminId = ctx.from.id.toString();
    if (!checkIfAdmin(adminId)) {
      return ctx.reply('🚫 You are not authorized.');
    }

    const args = ctx.message.text.split(' ');
    const targetId = args[1];
    if (!targetId) {
      return ctx.reply('ℹ️ Usage: /approve <playerId>');
    }

    const room = getRoomByPlayerId(targetId);
    if (!room) {
      return ctx.reply('❌ Player not found in any room.');
    }

    const player = room.players[targetId];
    if (!player || !player.hasWon) {
      return ctx.reply('⚠️ Player has not claimed Bingo.');
    }

    player.isApproved = true;

    await ctx.telegram.sendMessage(targetId, '✅ Your Bingo win has been approved!');
    ctx.reply(`🎉 Approved Bingo for ${player.username || targetId}`);
  });

  // 📊 Stats Command
  bot.command('stats', async (ctx) => {
    const adminId = ctx.from.id.toString();
    if (!checkIfAdmin(adminId)) {
      return ctx.reply('🚫 You are not authorized.');
    }

    try {
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
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
      ctx.reply('⚠️ Failed to fetch game stats.');
    }
  });
};
