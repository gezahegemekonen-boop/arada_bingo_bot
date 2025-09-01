import { validationResult } from 'express-validator';
import BingoRound from '../models/BingoRound.js';
import { checkWin, generateBingoCard } from '../utils/bingoLogic.js';
import validator from 'validator';

export const playBingo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const rawUserId = req.body.userId;
  const rawRoundId = req.body.roundId;
  const rawStake = req.body.stake;
  const calledNumbers = req.body.calledNumbers;
  const language = req.body.language || 'en';

  const userId = validator.trim(rawUserId?.toString() || '');
  const roundId = validator.trim(rawRoundId?.toString() || '');
  const stake = parseInt(rawStake, 10);

  if (!validator.isNumeric(userId) || userId.length < 5) {
    return res.status(400).json({ error: 'Invalid userId' });
  }
  if (!roundId || roundId.length < 3) {
    return res.status(400).json({ error: 'Invalid roundId' });
  }
  if (isNaN(stake) || stake <= 0) {
    return res.status(400).json({ error: 'Invalid stake amount' });
  }
  if (!Array.isArray(calledNumbers) || calledNumbers.length < 5) {
    return res.status(400).json({ error: 'Invalid calledNumbers' });
  }

  try {
    console.log('🔍 Called numbers:', calledNumbers);

    let round = await BingoRound.findOne({ userId, roundId });

    if (!round) {
      const card = generateBingoCard();
      round = await BingoRound.create({ userId, roundId, card, stake });
      console.log('🆕 New card generated:', card);
      return res.json({ message: '🎴 Card generated', card });
    }

    if (round.hasWon) {
      return res.json({ message: '✅ Already won', winType: round.winType });
    }

    const winType = checkWin(round.card, calledNumbers);
    console.log('🎯 Win type:', winType);

    if (winType) {
      round.hasWon = true;
      round.winType = winType;
      await round.save();

      if (language === 'am') {
        console.log('🔊 Amharic audio triggered for winType:', winType);
        // Optional: await playAmharicAudio(winType);
      }

      return res.json({ message: '🎉 You won!', winType });
    }

    return res.json({ message: '⏳ No win yet', card: round.card });
  } catch (err) {
    console.error('❌ playBingo error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};
