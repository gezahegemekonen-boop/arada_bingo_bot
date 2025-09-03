const Player = require('../models/Player');
const Round = require('../models/BingoRound'); // ✅ fixed import
const generateCard = require('../helpers/generateCard');

// ✅ Get all players
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ message: 'Server error while fetching players' });
  }
};

// ✅ Get single player by telegramId
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

// ✅ Update player balance and coins
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
      player.balance = wallet; // ✅ fix: schema uses balance, not wallet
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

// ✅ Play Bingo round
exports.playBingo = async (req, res) => {
  const { userId } = req.body;

  try {
    const player = await Player.findOne({ telegramId: userId });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    if (player.coins < 1) {
      return res.status(400).json({ message: 'Not enough coins to play' });
    }

    // Deduct coin
    player.coins -= 1;
    await player.save();

    // Generate Bingo card
    const card = generateCard();

    // Simple win logic (replace with your own)
    const isWin = Math.random() < 0.5;

    // Save round
    const round = await Round.create({
      userId,
      roundId: Date.now().toString(),
      card,
      hasWon: isWin,
      stake: 1,
      payoutAmount: isWin ? 2 : 0,
      status: isWin ? 'won' : 'pending'
    });

    res.status(200).json({
      success: true,
      result: isWin ? 'win' : 'lose',
      card,
      coinsLeft: player.coins
    });
  } catch (err) {
    console.error('Error during Bingo play:', err);
    res.status(500).json({ message: 'Server error while playing Bingo' });
  }
};
