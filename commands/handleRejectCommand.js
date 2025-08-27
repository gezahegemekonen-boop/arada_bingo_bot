const { getRoomByPlayerId } = require('../utils/roomManager');

module.exports = (bot) => {
  bot.command('reject', async (ctx) => {
    const adminId = ctx.from.id.toString();
    const isAdmin = require('../utils/checkIfAdmin')(adminId);
    if (!isAdmin) return ctx.reply('🚫 You are not authorized.');

    const args = ctx.message.text.split(' ');
    const targetId = args[1];
    if (!targetId) return ctx.reply('ℹ️ Usage: /reject <playerId>');

    const room = getRoomByPlayerId(targetId);
    if (!room) return ctx.reply('❌ Player not found in any room.');

    const player = room.players.find(p => p.telegramId === targetId);
    if (!player || !player.hasWon) {
      return ctx.reply('⚠️ Player has not claimed Bingo.');
    }

    player.hasWon = false;

    await ctx.telegram.sendMessage(targetId, '❌ Your Bingo claim was rejected.');
    ctx.reply(`🚫 Rejected Bingo for ${player.username}`);
  });
};
