function isBingo(card, calledNumbers) {
  // Helper to check if a cell is marked
  const isMarked = (value) => value === 'FREE' || calledNumbers.includes(value);

  // Check rows
  for (let row of card) {
    if (row.every(isMarked)) return true;
  }

  // Check columns
  for (let col = 0; col < 5; col++) {
    let column = card.map(row => row[col]);
    if (column.every(isMarked)) return true;
  }

  // Check diagonals
  const diag1 = [0, 1, 2, 3, 4].map(i => card[i][i]);
  const diag2 = [0, 1, 2, 3, 4].map(i => card[i][4 - i]);
  if (diag1.every(isMarked) || diag2.every(isMarked)) return true;

  // Check four corners
  const corners = [card[0][0], card[0][4], card[4][0], card[4][4]];
  if (corners.every(isMarked)) return true;

  return false;
}

module.exports = isBingo;
