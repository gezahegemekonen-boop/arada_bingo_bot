const Player = require('../models/Player');

// Get all players
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ message: 'Server error while fetching players' });
  }
};

// Get single player by telegramId
exports.getPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing telegramId' });

    const player = await Player.findOne({ telegramId: id });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    res.status(200).json(player);
  } catch (err) {
    console.error('Error fetching player:', err);
    res.status(500).json({ message: 'Server error while fetching player' });
  }
};

// Update player wallet and coins
exports.updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { wallet, coins } = req.body;

    if (!id) return res.status(400).json({ message: 'Missing telegramId' });

    const player = await Player.findOne({ telegramId: id });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    if (wallet !== undefined) {
      if (typeof wallet !== 'number' || wallet < 0) {
        return res.status(400).json({ message: 'Invalid wallet value' });
      }
      player.wallet = wallet;
    }

    if (coins !== undefined) {
      if (typeof coins !== 'number' || coins < 0) {
        return res.status(400).json({ message: 'Invalid coins value' });
      }
      player.coins = coins;
    }

    await player.save();
    res.status(200).json(player);
  } catch (err) {
    console.error('Error updating player:', err);
    res.status(500).json({ message: 'Server error while updating player' });
  }
};
