// utils/numberCaller.js
class NumberCaller {
  constructor() {
    this.calledNumbers = [];
    this.interval = null;
    this.maxNumber = 90; // Easily adjustable for different Bingo variants
  }

  start(players, sendMessage) {
    const allNumbers = Array.from({ length: this.maxNumber }, (_, i) => i + 1);
    this.calledNumbers = [];

    // Clear any previous interval before starting a new one
    this.stop();

    this.interval = setInterval(() => {
      if (this.calledNumbers.length >= this.maxNumber) {
        this.stop();
        return;
      }

      const remaining = allNumbers.filter(n => !this.calledNumbers.includes(n));
      const next = remaining[Math.floor(Math.random() * remaining.length)];
      this.calledNumbers.push(next);

      players.forEach(player => {
        const message = this.getLocalizedMessage(next, player.language);
        sendMessage(player.telegramId, message);
      });
    }, 3000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getCalledNumbers() {
    return this.calledNumbers;
  }

  getLocalizedMessage(number, lang) {
    const label = this.getColumnLabel(number); // Optional: adds B-I-N-G-O style label
    const formatted = `${label}-${number}`;

    if (lang === 'am') {
      return `🎱 ቁጥሩ የተጠራው: ${formatted}`;
    }
    return `🎱 Number called: ${formatted}`;
  }

  getColumnLabel(n) {
    // Optional: adjust ranges if using 90-ball Bingo
    if (n <= 15) return 'B';
    if (n <= 30) return 'I';
    if (n <= 45) return 'N';
    if (n <= 60) return 'G';
    if (n <= 75) return 'O';
    return 'X'; // For numbers 76–90
  }
}

module.exports = new NumberCaller();


