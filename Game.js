// Bingo game logic
function generateBingoCard() {
  const card = [];
  for (let i = 0; i < 5; i++) {
    card[i] = [];
    for (let j = 0; j < 5; j++) {
      card[i][j] = Math.floor(Math.random() * 75) + 1;
    }
  }
  return card;
}

class BingoGame {
  constructor() {
    this.drawnNumbers = [];
  }

  drawNumber() {
    const number = Math.floor(Math.random() * 75) + 1;
    if (!this.drawnNumbers.includes(number)) {
      this.drawnNumbers.push(number);
    }
    return number;
  }
}

function checkWin(card, drawnNumbers) {
  // Example win check: diagonal
  return card.every((row, i) => drawnNumbers.includes(row[i]));
}

module.exports = { generateBingoCard, BingoGame, checkWin };
