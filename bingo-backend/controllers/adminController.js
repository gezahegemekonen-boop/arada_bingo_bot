import Round from '../models/BingoRound.js';
import Player from '../models/Player.js';

// ✅ Get all pending rounds
export const getPendingRounds = async (req, res) => {
  try {
    const pendingRounds = await Round.find({ status: 'pending' });
    res.status(200).json(pendingRounds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching pending rounds' });
  }
};

// ✅ Approve a round and send payout
export const approveRound = async (req, res) => {
  try {
    const { roundId } = req.params;
    const round = await Round.findOne({ roundId });

    if (!round) return res.status(404).json({ message: 'Round not found' });
    if (round.status !== 'pending') return res.status(400).json({ message: 'Round already processed' });

    const player = await Player.findOne({ telegramId: round.userId });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    player.balance += round.payoutAmount;
    await player.save();

    round.status = 'won';
    await round.save();

    res.status(200).json({ message: 'Round approved and payout sent', round });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error approving round' });
  }
};

// ✅ Reject a round and refund coin
export const rejectRound = async (req, res) => {
  try {
    const { roundId } = req.params;
    const round = await Round.findOne({ roundId });

    if (!round) return res.status(404).json({ message: 'Round not found' });
    if (round.status !== 'pending') return res.status(400).json({ message: 'Round already processed' });

    const player = await Player.findOne({ telegramId: round.userId });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    player.coins += round.stake; // refund coin
    await player.save();

    round.status = 'rejected';
    round.payoutAmount = 0;
    await round.save();

    res.status(200).json({ message: 'Round rejected and coin refunded', round });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error rejecting round' });
  }
};

// ✅ Get basic stats
export const getStats = async (req, res) => {
  try {
    const totalRounds = await Round.countDocuments();
    const totalWins = await Round.countDocuments({ status: 'won' });
    const totalRejected = await Round.countDocuments({ status: 'rejected' });
    const totalPending = await Round.countDocuments({ status: 'pending' });

    res.status(200).json({
      totalRounds,
      totalWins,
      totalRejected,
      totalPending
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};
