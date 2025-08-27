// handlers/bingoClaim.js
const { isBingo } = require('../utils/bingoValidator');
const numberCaller = require('../utils/numberCaller');
const Player = require('../models/Player');
const bot = require('../bot');

async function handleBingoClaim(playerId) {
  const player = await Player.findOne({ telegramId: playerId });
  const calledNumbers = numberCaller.getCalledNumbers();

  if (!player || !player.card) {
    return bot.sendMessage(playerId, '❌ No card found.');
  }

  const won = isBingo(player.card, calledNumbers);

  if (won) {
    const stake = 100;
    const winnerShare = stake * 0.8;
    const adminShare = stake * 0.18;
    const jackpotShare = stake * 0.02;

    player.balance += winnerShare;
    const admin = await Player.findOne({ isAdmin: true });
    admin.balance += adminShare;

    await player.save();
    await admin.save();

    const msg = player.language === 'am'
      ? `🎉 አንተ አሸናፊ ነህ። ${winnerShare} ብር ተቀበልህ።`
      : `🎉 You won! You received ${winnerShare} ETB.`;

    bot.sendMessage(playerId, msg);
  } else {
    const msg = player.language === 'am'
      ? '❌ የተሳሳተ ቢንጎ ነው።'
      : '❌ Invalid Bingo claim.';
    bot.sendMessage(playerId, msg);
  }
}
