const Player = require('../models/Player');
const Round = require('../models/BingoRound');
const generateCard = require('../helpers/generateCard');

// Get all players
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Play Bingo
exports.playBingo = async (req, res) => {
  const { userId } = req.body;

  try {
    const player = await Player.findOne({ telegramId: userId });
    if (!player) return res.status(404).json({ message: 'Player not found' });
    if (player.coins < 1) return res.status(400).json({ message: 'Not enough coins' });

    player.coins -= 1;
    await player.save();

    const card = generateCard();
    const isWin = Math.random() < 0.5;

    const round = await Round.create({
      userId,
      roundId: Date.now().toString(),
      card,
      hasWon: isWin,
      stake: 1,
      payoutAmount: isWin ? 2 : 0,
      status: isWin ? 'won' : 'pending'
    });

    res.status(200).json({ success: true, result: isWin ? 'win' : 'lose', card, coinsLeft: player.coins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while playing Bingo' });
  }
};
