const Player = require('../models/Player');
const Round = require('../models/BingoRound');
const generateCard = require('../helpers/generateCard');

exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching players' });
  }
};

exports.getPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing telegramId' });

    const player = await Player.findOne({ telegramId: id });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    res.status(200).json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching player' });
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { balance, coins } = req.body;

    const player = await Player.findOne({ telegramId: id });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    if (balance !== undefined) player.balance = balance;
    if (coins !== undefined) player.coins = coins;

    await player.save();
    res.status(200).json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating player' });
  }
};

exports.playBingo = async (req, res) => {
  const { userId } = req.body;

  try {
    const player = await Player.findOne({ telegramId: userId });
    if (!player) return res.status(404).json({ message: 'Player not found' });
    if (player.coins < 1) return res.status(400).json({ message: 'Not enough coins to play' });

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

    res.status(200).json({
      success: true,
      result: isWin ? 'win' : 'lose',
      card,
      coinsLeft: player.coins
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while playing Bingo' });
  }
};
