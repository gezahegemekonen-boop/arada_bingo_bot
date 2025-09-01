const BingoRound = require('../models/BingoRound');
const { checkWin, generateBingoCard } = require('../utils/bingoLogic');
const validator = require('validator');

async function playBingo(req, res) {
  const rawUserId = req.body.userId;
  const rawRoundId = req.body.roundId;
  const rawStake = req.body.stake;
  const calledNumbers = req.body.calledNumbers;

  // 🧼 Sanitize
  const userId = validator.trim(rawUserId?.toString() || '');
  const roundId = validator.trim(rawRoundId?.toString() || '');
  const stake = parseInt(rawStake, 10);

  // ✅ Validate
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
    let round = await BingoRound.findOne({ userId, roundId });

    if (!round) {
      const card = generateBingoCard();
      round = await BingoRound.create({ userId, roundId, card, stake });
      return res.json({ message: '🎴 Card generated', card });
    }

    if (round.hasWon) {
      return res.json({ message: '✅ Already won', winType: round.winType });
    }

    const winType = checkWin(round.card, calledNumbers);
    if (winType) {
      round.hasWon = true;
      round.winType = winType;
      await round.save();

      // 💰 Payout logic (placeholder)
      // await processPayout(userId, stake, winType);

      // 🔊 Optional Amharic audio trigger
      // if (req.body.language === 'am') {
      //   await playAmharicAudio(winType);
      // }

      return res.json({ message: '🎉 You won!', winType });
    }

    return res.json({ message: '⏳ No win yet', card: round.card });
  } catch (err) {
    console.error('❌ playBingo error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { playBingo };
