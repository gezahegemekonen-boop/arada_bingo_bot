const { getRoomByPlayerId } = require('../../utils/roomManager');
const checkIfAdmin = require('../../utils/checkIfAdmin');
const Player = require('../../models/Player');

module.exports = (bot) => {
  bot.onText(/\/approve (\d+)/, async (msg, match) => {
    const adminId = msg.from.id.toString();
    if (!checkIfAdmin(adminId)) return bot.sendMessage(adminId, '🚫 You are not authorized.');

    const targetId = match[1];
    const room = getRoomByPlayerId(targetId);
    if (!room) return bot.sendMessage(adminId, '❌ Player not found in any room.');

    const player = room.players[targetId];
    if (!player || !player.hasWon) return bot.sendMessage(adminId, '⚠️ Player has not claimed Bingo.');

    player.isApproved = true;

    await bot.sendMessage(targetId, '✅ Your Bingo win has been approved!');
    bot.sendMessage(adminId, `🎉 Approved Bingo for ${player.username || targetId}`);
  });
};
