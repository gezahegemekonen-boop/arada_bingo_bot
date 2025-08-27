const { rooms } = require('../utils/roomManager');

module.exports = (bot) => {
  bot.command('rooms', async (ctx) => {
    const roomKeys = Object.keys(rooms);
    if (roomKeys.length === 0) {
      return ctx.reply('📭 No active Bingo rooms right now.');
    }

    let message = '🏠 Active Bingo Rooms:\n\n';
    for (const stake of roomKeys) {
      const room = rooms[stake];
      message += `💰 Stake: ${stake} | 👥 Players: ${room.players.length}\n`;
    }

    ctx.reply(message);
  });
};
