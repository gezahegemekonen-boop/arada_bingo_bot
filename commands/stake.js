const Room = require('../models/Room');
const Player = require('../models/Player');
const RoomManager = require('../game/roomManager');

bot.command('stake', async (ctx) => {
  const amount = parseInt(ctx.message.text.split(' ')[1]);
  const validStakes = [10, 20, 30, 50, 100];
  if (!validStakes.includes(amount)) {
    return ctx.reply('❌ Invalid stake. Choose: 10, 20, 30, 50, or 100 ETB.');
  }

  const telegramId = ctx.from.id.toString();
  const player = await Player.findOne({ telegramId });
  if (!player) {
    return ctx.reply('❌ You need to /register first.');
  }

  // Find or create the room for this stake
  let room = await Room.findOne({ stake: amount });
  if (!room) {
    room = new Room({ stake: amount });
    await room.save();
  }

  const currentRoundId = room.roundId;

  // Check if player already joined this round
  if (player.lastJoinedRound === currentRoundId) {
    return ctx.reply(`✅ You already joined the ${amount} ETB room for this round.`);
  }

  // Check balance
  if (player.balance < amount) {
    return ctx.reply('❌ Insufficient balance.');
  }

  // Deduct and assign
  player.balance -= amount;
  player.currentStake = amount;
  player.lastJoinedRound = currentRoundId;
  await player.save();

  await RoomManager.addPlayerToRoom(player, amount, currentRoundId);
  ctx.reply(`✅ You joined the ${amount} ETB room for this round. Waiting for others...`);
});
