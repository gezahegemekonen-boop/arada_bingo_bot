const { getRoomByPlayerId, removePlayerFromRoom } = require('../utils/roomManager');

module.exports = (bot) => {
  bot.command('leave', async (ctx) => {
    const playerId = ctx.from.id.toString();
    const room = getRoomByPlayerId(playerId);

    if (!room) {
      return ctx.reply('❌ You are not in any Bingo room.');
    }

    removePlayerFromRoom(playerId);

    const lang = room.players.find(p => p.telegramId === playerId)?.language || 'en';
    const message = lang === 'am'
      ? '👋 ከቢንጎ ዙር ወጥተዋል። እንኳን ደስ አላችሁ!'
      : '👋 You’ve left the Bingo room. See you next time!';
    ctx.reply(message);
  });
};
