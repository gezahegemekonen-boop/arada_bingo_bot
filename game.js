// game.js
function generateBingoCard() {
  const card = [];
  const ranges = [
    [1, 15],
    [16, 30],
    [31, 45],
    [46, 60],
    [61, 75],
  ];

  for (let col = 0; col < 5; col++) {
    const [min, max] = ranges[col];
    const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    const selected = [];

    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * numbers.length);
      selected.push(numbers.splice(idx, 1)[0]);
    }

    card.push(selected);
  }

  card[2][2] = "FREE"; // Center space
  return card;
}

class BingoGame {
  constructor() {
    this.drawnNumbers = [];
  }

  drawNumber() {
    const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    const remaining = allNumbers.filter((n) => !this.drawnNumbers.includes(n));

    if (remaining.length === 0) return null;

    const number = remaining[Math.floor(Math.random() * remaining.length)];
    this.drawnNumbers.push(number);
    return number;
  }
}

function checkWin(card, drawnNumbers) {
  // Check rows
  for (let row = 0; row < 5; row++) {
    if (card[row].every((n) => n === "FREE" || drawnNumbers.includes(n))) {
      return true;
    }
  }

  // Check columns
  for (let col = 0; col < 5; col++) {
    if (card.every((row) => row[col] === "FREE" || drawnNumbers.includes(row[col]))) {
      return true;
    }
  }

  // Check diagonals
  if (
    [0, 1, 2, 3, 4].every((i) => card[i][i] === "FREE" || drawnNumbers.includes(card[i][i]))
  ) {
    return true;
  }
  if (
    [0, 1, 2, 3, 4].every((i) => card[i][4 - i] === "FREE" || drawnNumbers.includes(card[i][4 - i]))
  ) {
    return true;
  }

  return false;
}

module.exports = { generateBingoCard, BingoGame, checkWin };
