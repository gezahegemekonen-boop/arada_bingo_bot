const BingoRound = require('../models/BingoRound');
const { checkWin, generateBingoCard } = require('../utils/bingoLogic');

async function playBingo(req, res) {
  const userId = req.body.userId;
  const roundId = req.body.roundId;
  const stake = req.body.stake;
  const calledNumbers = req.body.calledNumbers;

  let round = await BingoRound.findOne({ userId, roundId });

  if (!round) {
    const card = generateBingoCard();
    round = await BingoRound.create({ userId, roundId, card, stake });
    return res.json({ message: "Card generated", card });
  }

  if (round.hasWon) {
    return res.json({ message: "Already won", winType: round.winType });
  }

  const winType = checkWin(round.card, calledNumbers);
  if (winType) {
    round.hasWon = true;
    round.winType = winType;
    await round.save();

    // payout logic here
    // play Amharic audio if needed

    return res.json({ message: "You won!", winType });
  }

  return res.json({ message: "No win yet", card: round.card });
}

module.exports = { playBingo };
