const checkIfAdmin = require('../utils/checkIfAdmin');
const { getRoomByPlayerId, resetRoomByPlayerId } = require('../utils/roomManager');

module.exports = (bot) => {
  bot.command('reset', async (ctx) => {
    const isAdmin = checkIfAdmin(ctx.from.id);
    if (!isAdmin) return ctx.reply('🚫 You are not authorized.');

    const playerId = ctx.from.id.toString();
    const room = getRoomByPlayerId(playerId);

    if (!room) {
      return ctx.reply('❌ You are not in a game room.');
    }

    resetRoomByPlayerId(playerId); // ✅ Custom reset logic
    ctx.reply('🔄 Room has been reset. Ready for a new round!');
  });
};
