// utils/cardGenerator.js

function generateBingoCard() {
  const ranges = {
    B: [1, 15],
    I: [16, 30],
    N: [31, 45],
    G: [46, 60],
    O: [61, 75]
  };

  const columns = [];

  for (const col in ranges) {
    const [min, max] = ranges[col];
    const nums = shuffle(Array.from({ length: max - min + 1 }, (_, i) => i + min)).slice(0, 5);
    columns.push(nums);
  }

  // Transpose columns to rows
  const grid = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => columns[col][row])
  );

  // Set center cell as free space
  grid[2][2] = 'FREE';

  return {
    id: generateCardId(),
    headers: ['B', 'I', 'N', 'G', 'O'],
    grid
  };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateCardId() {
  return Math.random().toString(36).substring(2, 10);
}

module.exports = {
  generateBingoCard
};
