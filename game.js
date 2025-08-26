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
    if (this.numbers.length === 0) return;
    const num = this.numbers.splice(Math.floor(Math.random() * this.numbers.length), 1)[0];
    this.called.push(num);
    return num;
  }

  checkBingo(card) {
    // TODO: implement win conditions (row, column, diagonal, 4 corners)
  }
}

