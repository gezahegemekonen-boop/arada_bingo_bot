import { validationResult } from 'express-validator';
import BingoRound from '../models/BingoRound.js';
import { checkWin, generateBingoCard } from '../utils/bingoLogic.js';
import validator from 'validator';

export const playBingo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn('⚠️ Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    userId: rawUserId,
    roundId: rawRoundId,
    stake: rawStake,
    calledNumbers,
    language = 'en'
  } = req.body;

  const userId = validator.trim(rawUserId?.toString() || '');
  const roundId = validator.trim(rawRoundId?.toString() || '');
  const stake = parseInt(rawStake, 10);

  // ✅ Input validation
  if (!validator.isNumeric(userId) || userId.length < 5) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }
  if (!roundId || roundId.length < 3) {
    return res.status(400).json({ error: 'Invalid roundId format' });
  }
  if (isNaN(stake) || stake <= 0) {
    return res.status(400).json({ error: 'Stake must be a positive number' });
  }
  if (!Array.isArray(calledNumbers) || calledNumbers.length < 5) {
    return res.status(400).json({ error: 'calledNumbers must be an array of at least 5 numbers' });
  }

  try {
    console.log('🔍 Incoming play request:', { userId, roundId, stake, calledNumbers });

    let round = await BingoRound.findOne({ userId, roundId });

    if (!round) {
      const card = generateBingoCard();
      round = await BingoRound.create({
        userId,
        roundId,
        card,
        stake,
        status: 'pending',
        isDemo: false
      });
      console.log('🆕 New card generated for user:', userId);
      return res.json({ message: '🎴 Card generated', card });
    }

    if (round.hasWon) {
      console.log('✅ User already won:', { userId, roundId, winType: round.winType });
      return res.json({
        message: '✅ Already won',
        winType: round.winType,
        payoutAmount: round.payoutAmount,
        isPaid: round.isPaid,
        card: round.card
      });
    }

    const winType = checkWin(round.card, calledNumbers);
    console.log('🎯 Win check result:', winType);

    if (winType) {
      round.hasWon = true;
      round.winType = winType;
      round.status = 'won';
      round.payoutAmount = stake * 2; // 💸 Customize your payout formula here
      round.isPaid = false; // 🛂 Awaiting admin approval
      await round.save();

      if (language === 'am') {
        console.log('🔊 Amharic audio triggered for winType:', winType);
        // Optional: await playAmharicAudio(winType);
      }

      return res.json({
        message: '🎉 You won!',
        winType,
        payoutAmount: round.payoutAmount,
        isPaid: false,
        card: round.card
      });
    }

    return res.json({ message: '⏳ No win yet', card: round.card });
  } catch (err) {
    console.error('❌ playBingo error:', err);
    return res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
