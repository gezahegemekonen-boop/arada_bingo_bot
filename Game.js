// game.js

// STEP 1: Generate Bingo Card
function generateBingoCard() {
  const card = [];
  const ranges = {
    B: [1, 15],
    I: [16, 30],
    N: [31, 45],
    G: [46, 60],
    O: [61, 75],
  };

  for (const [key, [min, max]] of Object.entries(ranges)) {
    const column = [];
    while (column.length < 5) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!column.includes(num)) column.push(num);
    }
    card.push(column);
  }

  card[2][2] = "FREE"; // center space
  return card;
}

// STEP 2: Bingo Game Class
class BingoGame {
  constructor() {
    this.drawnNumbers = [];
    this.remainingNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
  }

  drawNumber() {
    if (this.remainingNumbers.length === 0) return null;
    const index = Math.floor(Math.random() * this.remainingNumbers.length);
    const number = this.remainingNumbers.splice(index, 1)[0];
    this.drawnNumbers.push(number);
    return number;
  }
}

// STEP 3: Check for Win
function checkWin(card, drawnNumbers) {
  const isMarked = (num) => num === "FREE" || drawnNumbers.includes(num);

  // Rows
  for (let row = 0; row < 5; row++) {
    if (card.every(col => isMarked(col[row]))) return true;
  }

  // Columns
  for (let col = 0; col < 5; col++) {
    if (card[col].every(num => isMarked(num))) return true;
  }

  // Diagonals
  const diag1 = [0, 1, 2, 3, 4].every(i => isMarked(card[i][i]));
  const diag2 = [0, 1, 2, 3, 4].every(i => isMarked(card[i][4 - i]));

  return diag1 || diag2;
}

// STEP 4: Export Functions
module.exports = {
  generateBingoCard,
  BingoGame,
  checkWin,
};

const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "active", "finished"], default: "pending" }
});

module.exports = mongoose.model("Game", GameSchema);
