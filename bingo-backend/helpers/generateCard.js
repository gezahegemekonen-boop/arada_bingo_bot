// Simple 5x5 Bingo card generator
module.exports = function generateCard() {
  const card = [];
  for (let i = 0; i < 5; i++) {
    const row = [];
    for (let j = 0; j < 5; j++) {
      row.push(Math.floor(Math.random() * 75) + 1); // Numbers 1-75
    }
    card.push(row);
  }
  // Optional: set middle cell as FREE
  card[2][2] = 'FREE';
  return card;
};
