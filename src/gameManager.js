import Game from './models/Game.js';
import Player from './models/Player.js';
import Transaction from './models/Transaction.js';
import { generateCard, checkBingo } from './utils/cards.js';
import { splitPot } from './utils/payouts.js';

export class GameManager {
  constructor({ bot, adminId }) {
    this.bot = bot;
    this.adminId = adminId;
    this.games = new Map(); // key = stake (Number) -> Game in memory OR DB representation
    this.callInterval = parseInt(process.env.CALL_INTERVAL_MS || '2500', 10);
    this.activeTimers = new Map();
  }

  // Create or get waiting game for a stake
  async getOrCreateWaitingGame(stake) {
    // Try DB first: find a waiting game same stake
    let dbGame = await Game.findOne({ stake, status: 'waiting' });
    if (!dbGame) {
      dbGame = new Game({ stake, status: 'waiting', pot: 0, players: [], cards: [], calledNumbers: [] });
      await dbGame.save();
    }
    return dbGame;
  }

  async buyCard(telegramId, stake) {
    const player = await Player.findOne({ telegramId });
    if (!player) throw new Error('player-not-found');
    if (player.balance < stake) throw new Error('insufficient-balance');
    const dbGame = await this.getOrCreateWaitingGame(stake);

    // Deduct balance and add card
    player.balance -= stake;
    await player.save();

    const { cardId, numbers } = generateCard();
    dbGame.cards.push({ playerId: telegramId, cardId, numbers });
    dbGame.players.push(telegramId);
    dbGame.pot += stake;
    await dbGame.save();
    return { cardId, numbers, pot: dbGame.pot, gameId: dbGame._id.toString() };
  }

  // Start game if not running and enough players (at least 1)
  async startGameIfReady(stake) {
    const dbGame = await Game.findOne({ stake, status: 'waiting' });
    if (!dbGame) return null;
    // If already running, return
    dbGame.status = 'running';
    // prepare call numbers 1..75 shuffled
    dbGame.calledNumbers = [];
    // we don't need to save full remaining bag, just pick random from 1..75 on each call while tracking calledNumbers
    await dbGame.save();

    // Start auto-calling
    this.scheduleCalls(dbGame._id.toString(), stake);
    return dbGame;
  }

  // picks a new number, records and notifies players
  async callNumber(gameId, stake) {
    const dbGame = await Game.findById(gameId);
    if (!dbGame || dbGame.status !== 'running') return null;
    // choose a random number not yet called
    const all = Array.from({ length: 75 }, (_, i) => i + 1);
    const called = new Set(dbGame.calledNumbers.map(Number));
    const available = all.filter((n) => !called.has(n));
    if (available.length === 0) {
      // no more numbers - end game
      dbGame.status = 'finished';
      await dbGame.save();
      return null;
    }
    const pick = available[Math.floor(Math.random() * available.length)];
    dbGame.calledNumbers.push(pick);
    await dbGame.save();

    // Notify players in this game by DM (we'll send to each unique telegramId)
    const uniquePlayers = Array.from(new Set(dbGame.players));
    uniquePlayers.forEach((tid) => {
      const text = `🔔 Number called: *${pick}*\nStake: ${dbGame.stake} ETB\nCalled count: ${dbGame.calledNumbers.length}`;
      this.bot.sendMessage(tid, text, { parse_mode: 'Markdown' }).catch(() => {});
    });

    return pick;
  }

  // schedule setInterval and keep track
  scheduleCalls(gameId, stake) {
    if (this.activeTimers.has(gameId)) return;
    const timer = setInterval(async () => {
      const pick = await this.callNumber(gameId, stake);
      if (!pick) {
        clearInterval(timer);
        this.activeTimers.delete(gameId);
        await this.finishGame(gameId);
      }
    }, this.callInterval);
    this.activeTimers.set(gameId, timer);
  }

  // Player attempts Bingo (client uses cardId)
  async claimBingo(telegramId, gameId, cardId) {
    const dbGame = await Game.findById(gameId);
    if (!dbGame || (dbGame.status !== 'running' && dbGame.status !== 'finished')) {
      throw new Error('no-running-game');
    }
    const card = dbGame.cards.find((c) => c.cardId === cardId && c.playerId === telegramId);
    if (!card) throw new Error('card-not-found');

    const calledSet = new Set(dbGame.calledNumbers);
    const valid = checkBingo(card.numbers, calledSet);
    if (!valid) {
      // false bingo -> disqualify player from this game (remove their cards and mark)
      dbGame.cards = dbGame.cards.filter((c) => c.playerId !== telegramId);
      dbGame.players = dbGame.players.filter((p) => p !== telegramId);
      await dbGame.save();
      const player = await Player.findOne({ telegramId });
      if (player) {
        this.bot.sendMessage(telegramId, '❌ False Bingo — you are disqualified from this round.');
        this.bot.sendMessage(this.adminId, `Player ${telegramId} disqualified for false Bingo in game ${gameId}.`);
      }
      return { ok: false, reason: 'false' };
    }

    // Valid bingo -> finalize game
    dbGame.winner = telegramId;
    dbGame.status = 'finished';
    await dbGame.save();

    // stop interval
    if (this.activeTimers.has(gameId)) {
      clearInterval(this.activeTimers.get(gameId));
      this.activeTimers.delete(gameId);
    }

    // compute payouts
    const pot = dbGame.pot;
    const { winner, admin, jackpot } = splitPot(pot);

    // credit winner balance
    const player = await Player.findOne({ telegramId });
    if (player) {
      player.balance += winner;
      player.wins = (player.wins || 0) + 1;
      await player.save();
    }

    // send messages to players and admin
    const uniquePlayers = Array.from(new Set(dbGame.players));
    uniquePlayers.forEach((tid) =>
      this.bot.sendMessage(tid, `🏆 Bingo! Winner: ${telegramId}\nPot: ${pot} ETB\nWinner prize: ${winner} ETB`)
    );
    this.bot.sendMessage(this.adminId, `Game finished. Winner ${telegramId}. Payout - Winner:${winner}, Admin:${admin}, Jackpot:${jackpot}`);

    return { ok: true, winnerPrize: winner, admin, jackpot };
  }

  // finish game fallback when numbers exhausted
  async finishGame(gameId) {
    const dbGame = await Game.findById(gameId);
    if (!dbGame) return;
    if (dbGame.status === 'finished') return;
    dbGame.status = 'finished';
    await dbGame.save();
    this.bot.sendMessage(this.adminId, `Game ${gameId} ended without winner (numbers exhausted). Pot: ${dbGame.pot}`);
  }

  // Admin approves deposit / withdraw
  async createTransaction(type, telegramId, amount) {
    const t = new (await import('./models/Transaction.js')).default({ type, playerId: telegramId, amount });
    await t.save();
    return t;
  }

  async approveTransaction(txId, approverId) {
    const tx = await (await import('./models/Transaction.js')).default.findById(txId);
    if (!tx) throw new Error('tx-not-found');
    if (approverId.toString() !== this.adminId.toString()) throw new Error('not-admin');

    tx.status = 'approved';
    await tx.save();
    if (tx.type === 'deposit') {
      const p = await Player.findOne({ telegramId: tx.playerId });
      if (p) {
        p.balance += tx.amount;
        await p.save();
        this.bot.sendMessage(tx.playerId, `✅ Deposit approved: +${tx.amount} ETB. New balance: ${p.balance} ETB`);
      }
    } else if (tx.type === 'withdrawal') {
      // manual processing: admin should send funds externally then mark approved
      const p = await Player.findOne({ telegramId: tx.playerId });
      if (p) {
        p.balance -= tx.amount;
        await p.save();
        this.bot.sendMessage(tx.playerId, `✅ Withdrawal approved: -${tx.amount} ETB. New balance: ${p.balance} ETB`);
      }
    }
    return tx;
  }

  async rejectTransaction(txId, note) {
    const tx = await (await import('./models/Transaction.js')).default.findById(txId);
    if (!tx) throw new Error('tx-not-found');
    tx.status = 'rejected';
    tx.adminNote = note;
    await tx.save();
    this.bot.sendMessage(tx.playerId, `❌ Your transaction ${txId} was rejected. Note: ${note}`);
    return tx;
  }

  // utility: create player record if missing
  static async ensurePlayer(telegramMsg) {
    const Player = (await import('./models/Player.js')).default;
    const telegramId = telegramMsg.from.id.toString();
    let p = await Player.findOne({ telegramId });
    if (!p) {
      p = new Player({
        telegramId,
        username: telegramMsg.from.username || `${telegramMsg.from.first_name || ''} ${telegramMsg.from.last_name || ''}`
      });
      await p.save();
    }
    return p;
  }

}
