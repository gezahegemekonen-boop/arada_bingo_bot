const generateBingoCard = require('../utils/cardGenerator');
const Player = require('../models/Player');

async function assignCard(playerId) {
  const card = generateBingoCard();
  await Player.updateOne({ telegramId: playerId }, { card });
  return card;
}
