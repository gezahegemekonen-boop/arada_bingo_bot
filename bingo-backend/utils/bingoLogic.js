function checkRowWin(card, calledNumbers) {
  return card.some(row => row.every(num => num === "FREE" || calledNumbers.includes(num)));
}

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

function checkDiagonalWin(card, calledNumbers) {
  const leftToRight = card.every((row, i) => row[i] === "FREE" || calledNumbers.includes(row[i]));
  const rightToLeft = card.every((row, i) => row[4 - i] === "FREE" || calledNumbers.includes(row[4 - i]));
  return leftToRight || rightToLeft;
}

function checkFourCorners(card, calledNumbers) {
  const corners = [
    card[0][0], card[0][4],
    card[4][0], card[4][4]
  ];
  return corners.every(num => calledNumbers.includes(num));
}

function checkWin(card, calledNumbers) {
  if (checkRowWin(card, calledNumbers)) return "row";
  if (checkColumnWin(card, calledNumbers)) return "column";
  if (checkDiagonalWin(card, calledNumbers)) return "diagonal";
  if (checkFourCorners(card, calledNumbers)) return "corners";
  return null;
}

function generateBingoCard() {
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

module.exports = { checkWin, generateBingoCard };

