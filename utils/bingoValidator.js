// utils/bingoValidator.js

function isBingo(cardGrid, calledNumbers) {
  const isMarked = (value) => value === 'FREE' || calledNumbers.includes(value);

  // ✅ Check rows
  for (let row of cardGrid) {
    if (row.every(isMarked)) return true;
  }

  // ✅ Check columns
  for (let col = 0; col < 5; col++) {
    const column = cardGrid.map(row => row[col]);
    if (column.every(isMarked)) return true;
  }

  // ✅ Check diagonals
  const diag1 = [0, 1, 2, 3, 4].map(i => cardGrid[i][i]);
  const diag2 = [0, 1, 2, 3, 4].map(i => cardGrid[i][4 - i]);
  if (diag1.every(isMarked) || diag2.every(isMarked)) return true;

  // ✅ Check four corners
  const corners = [cardGrid[0][0], cardGrid[0][4], cardGrid[4][0], cardGrid[4][4]];
  if (corners.every(isMarked)) return true;

  return false;
}

module.exports = { isBingo };
