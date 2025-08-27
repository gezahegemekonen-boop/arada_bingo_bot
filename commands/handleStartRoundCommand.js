const checkIfAdmin = require('../utils/checkIfAdmin');
const { getRoomByPlayerId } = require('../utils/roomManager');
const { generateCard } = require('../utils/cardGenerator');

module.exports = (bot) => {
  bot.command('startRound', async (ctx) => {
    const isAdmin = checkIfAdmin(ctx.from.id);
    if (!isAdmin) return ctx.reply('🚫 You are not authorized.');

    const playerId = ctx.from.id.toString();
    const room = getRoomByPlayerId(playerId);

    if (!room) return ctx.reply('❌ You are not in a game room.');
    if (room.isActive) return ctx.reply('⚠️ Round already in progress.');

    // Reset winners and assign fresh cards
    room.winners = [];
    room.cards = Array.from({ length: 100 }, () => generateCard());

    for (const player of room.players) {
      player.card = room.cards.pop();
      player.hasWon = false;

      const message = player.language === 'am'
        ? '🆕 አዲስ ቢንጎ ዙር ተጀመረ። እንኳን ደስ አላችሁ!'
        : '🆕 New Bingo round started! Good luck!';
      await ctx.telegram.sendMessage(player.telegramId, message);
    }

    room.isActive = true;
    room.caller.start(room.players, sendMessage); // Make sure sendMessage is defined
