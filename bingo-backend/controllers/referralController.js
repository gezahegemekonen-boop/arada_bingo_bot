import Player from '../models/Player.js';

export const getReferralStats = async (req, res) => {
  const { telegramId } = req.params;

  try {
    const player = await Player.findOne({ telegramId });

    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    res.status(200).json({
      success: true,
      referralCode: player.referralCode || telegramId,
      referrals: player.referrals?.length || 0,
      coinsEarned: player.referralCoins || 0
    });
  } catch (err) {
    console.error('Error fetching referral stats:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching referral stats' });
  }
};
