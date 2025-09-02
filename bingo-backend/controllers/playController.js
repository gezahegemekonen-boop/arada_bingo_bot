const Player = require('../models/Player');

// Get all players
exports.getAllPlayers = async (req, res) => {
  const players = await Player.find();
  res.json(players);
};

// Get single player
exports.getPlayer = async (req, res) => {
  const player = await Player.findOne({ telegramId: req.params.id });
  if (!player) return res.status(404).json({ message: 'Player not found' });
  res.json(player);
};

// Update player wallet/coins
exports.updatePlayer = async (req, res) => {
  const player = await Player.findOne({ telegramId: req.params.id });
  if (!player) return res.status(404).json({ message: 'Player not found' });

  const { wallet, coins } = req.body;
  if (wallet !== undefined) player.wallet = wallet;
  if (coins !== undefined) player.coins = coins;

  await player.save();
  res.json(player);
};
