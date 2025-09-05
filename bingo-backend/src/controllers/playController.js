import Player from '../models/Player.js';
import BingoRound from '../models/BingoRound.js';
import generateCard from '../helpers/generateCard.js';

// GET all players
export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().select('-__v'); // exclude internal fields
    res.status(200).json({ success: true, count: players.length, players });
  } catch (err) {
    console.error('❌ Error fetching players:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching players' });
  }
};

// GET single player by telegramId
export const getPlayer = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ success: false, message: 'Missing telegramId' });

  try {
    const player = await Player.findOne({ telegramId: id });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found' });

    res.status(200).json({ success: true, player });
  } catch (err) {
    console.error('❌ Error fetching player:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching player' });
  }
};

// PUT update player wallet or coins
export const updatePlayer = async (req, res) => {
  const { id } = req.params;
  const { wallet, coins } = req.body;

  if (!id) return res.status(400).json({ success: false, message: 'Missing telegramId' });

  try {
    const player = await Player.findOne({ telegramId: id });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found' });

    if (wallet !== undefined) {
      if (typeof wallet !== 'number' || wallet < 0)
        return res.status(400).json({ success: false, message: 'Invalid wallet value' });
      player.balance = wallet;
    }

    if (coins !== undefined) {
      if (typeof coins !== 'number' || coins < 0)
        return res.status(400).json({ success: false, message: 'Invalid coins value' });
      player.coins = coins;
    }

    await player.save();
    res.status(200).json({ success: true, updated: true, player });
  } catch (err) {
    console.error('❌ Error updating player:', err);
    res.status(500).json({ success: false, message: 'Server error while updating player' });
  }
};

// POST play Bingo
export const playBingo = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ success: false, message: 'Missing userId' });

  try {
    const player = await Player.findOne({ telegramId: userId });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
    if (player.coins < 1) return res.status(400).json({ success: false, message: 'Not enough coins to play' });

    player.coins -= 1;
    player.lastPlayed = new Date();
    await player.save();

    const card = generateCard();
    const isWin = Math.random() < 0.5;

    const round = await BingoRound.create({
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
      coinsLeft: player.coins,
      roundId: round.roundId
    });
  } catch (err) {
    console.error('❌ Error during Bingo play:', err);
    res.status(500).json({ success: false, message: 'Server error while playing Bingo' });
  }
};
