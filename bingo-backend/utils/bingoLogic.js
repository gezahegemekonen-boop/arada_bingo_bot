// Check for row win
function checkRowWin(card, calledNumbers) {
  return card.some(row =>
    row.every(num => num === "FREE" || calledNumbers.includes(num))
  );
}

// Check for column win
function checkColumnWin(card, calledNumbers) {
  for (let col = 0; col < 5; col++) {
    let win = true;
    for (let row = 0; row < 5; row++) {
      const num = card[row][col];
      if (num !== "FREE" && !calledNumbers.includes(num)) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }
  return false;
}

// Check for diagonal win
function checkDiagonalWin(card, calledNumbers) {
  const leftToRight = card.every((row, i) =>
    row[i] === "FREE" || calledNumbers.includes(row[i])
  );
  const rightToLeft = card.every((row, i) =>
    row[4 - i] === "FREE" || calledNumbers.includes(row[4 - i])
  );
  return leftToRight || rightToLeft;
}

// Check for four corners win
function checkFourCorners(card, calledNumbers) {
  const corners = [
    card[0][0], card[0][4],
    card[4][0], card[4][4]
  ];
  return corners.every(num => calledNumbers.includes(num));
}

// Master win checker
export function checkWin(card, calledNumbers) {
  if (checkRowWin(card, calledNumbers)) return "row";
  if (checkColumnWin(card, calledNumbers)) return "column";
  if (checkDiagonalWin(card, calledNumbers)) return "diagonal";
  if (checkFourCorners(card, calledNumbers)) return "corners";
  return null;
}

// Generate a 5x5 Bingo card with column ranges and center FREE
export function generateBingoCard() {
  const card = [];
  const ranges = [
    [1, 15], [16, 30], [31, 45], [46, 60], [61, 75]
  ];

  for (let col = 0; col < 5; col++) {
    const nums = [];
    while (nums.length < 5) {
      const num = Math.floor(Math.random() * (ranges[col][1] - ranges[col][0] + 1)) + ranges[col][0];
      if (!nums.includes(num)) nums.push(num);
    }
    for (let row = 0; row < 5; row++) {
      if (!card[row]) card[row] = [];
      card[row][col] = nums[row];
    }
  }

  card[2][2] = "FREE";
  return card;
}
