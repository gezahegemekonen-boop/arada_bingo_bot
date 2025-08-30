// helpers/generateCard.js

function generateCard() {
  const card = [];
  const columns = [
    { start: 1, end: 15 },
    { start: 16, end: 30 },
    { start: 31, end: 45 },
    { start: 46, end: 60 },
    { start: 61, end: 75 }
  ];

  for (let col = 0; col < columns.length; col++) {
    const nums = [];
    while (nums.length < 5) {
      const num = Math.floor(Math.random() * (columns[col].end - columns[col].start + 1)) + columns[col].start;
      if (!nums.includes(num)) nums.push(num);
    }
    card.push(nums);
  }

  const transposed = [];
  for (let row = 0; row < 5; row++) {
    transposed[row] = card.map(col => col[row]);
  }

  transposed[2][2] = 'FREE';
  return transposed;
}

module.exports = generateCard;

