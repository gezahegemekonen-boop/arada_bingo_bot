// game.js

export class BingoGame {
  constructor(stake) {
    this.stake = stake;
    this.players = [];
    this.cards = [];
    this.numbers = Array.from({ length: 75 }, (_, i) => i + 1);
    this.called = [];
    this.active = false;
  }

  join(player, card) {
    if (this.active) return false;
    this.players.push({ player, card });
    return true;
  }

  start() {
    this.active = true;
    this.callNext();
  }

  callNext() {
    if (this.numbers.length === 0) return null;
    const index = Math.floor(Math.random() * this.numbers.length);
    const num = this.numbers.splice(index, 1)[0];
    this.called.push(num);
    return num;
  }

  checkBingo(card) {
    // TODO: Implement win conditions (row, column, diagonal, 4 corners)
    return false;
  }
}

// ✅ Generate a Bingo card
export function generateBingoCard() {
  const card = [];

  for (let row = 0; row < 5; row++) {
    const rowValues = [];
    for (let col = 0; col < 5; col++) {
      const min = col * 15 + 1;
      const max = col * 15 + 15;
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      rowValues.push(num);
    }
    card.push(rowValues);
  }

  // Add "FREE" space in the center
  card[2][2] = 'FREE';

  return card;
}

// ✅ Wrap gameplay logic for API
export async function playGame(userId) {
  const stake = 10; // You can customize this later
  const game = new BingoGame(stake);

  const card = generateBingoCard();
  const joined = game.join(userId, card);

  if (!joined) {
    throw new Error('Game already started or user already joined');
  }

  game.start();
  const firstCall = game.called[0];

  return {
    userId,
    stake,
    card,
    firstCall,
    calledNumbers: game.called,
    message: `Game started for user ${userId}. First number called: ${firstCall}`
  };
}
