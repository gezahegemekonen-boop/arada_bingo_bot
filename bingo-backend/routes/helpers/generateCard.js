module.exports = function generateCard() {
  const card = [];
  for (let i = 0; i < 5; i++) {
    const row = [];
    for (let j = 0; j < 5; j++) {
      row.push(Math.floor(Math.random() * 100) + 1);
    }
    card.push(row);
  }
  // Optional: free center
  card[2][2] = 'FREE';
  return card;
};

