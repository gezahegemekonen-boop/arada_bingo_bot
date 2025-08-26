// utils/numberCaller.js
class NumberCaller {
  constructor() {
    this.calledNumbers = [];
    this.interval = null;
  }

  start(players, sendMessage) {
    const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
    this.calledNumbers = [];

    this.interval = setInterval(() => {
      if (this.calledNumbers.length >= 90) {
        clearInterval(this.interval);
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
    clearInterval(this.interval);
  }

  getCalledNumbers() {
    return this.calledNumbers;
  }

  getLocalizedMessage(number, lang) {
    if (lang === 'am') {
      return `🎱 ቁጥሩ የተጠራው: ${number}`;
    }
    return `🎱 Number called: ${number}`;
  }
}

module.exports = new NumberCaller();
