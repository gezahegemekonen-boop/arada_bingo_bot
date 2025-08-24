const { Markup } = require('telegraf');
const Game = require('./models/Game');
const Player = require('./models/Player');
const Tx = require('./models/Tx');
const Setting = require('./models/Setting');
const cfg = require('./config');

// in-memory timers per stake group
const timers = new Map();

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

function generateBingoSequence() {
  const arr = Array.from({length:75}, (_,i)=>i+1);
  for (let i=arr.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function getOrCreateGame(stake) {
  let g = await Game.findOne({ stake, status: { $in: ['waiting','countdown','running'] } });
  if (!g) {
    g = await Game.create({ stake, status: 'waiting', jackpotPool: 0, pot: 0, round: 1 });
  }
  return g;
}

async function isAntiCheatOn() {
  const s = await Setting.findOne({ key: 'antiCheat' });
  if (!s) return cfg.ANTI_CHEAT_DEFAULT;
  return !!s.value;
}

async function joinGame(ctx, stake) {
  const tgId = String(ctx.from.id);
  const p = await Player.findOne({ tgId });
  if (!p) return ctx.reply("Please /start first.");
  if (p.wallet < stake) return ctx.reply(`Insufficient balance. You need ${stake} ETB.`);
  const g = await getOrCreateGame(stake);
  if (g.status === 'running') return ctx.reply("Round already running. Wait for next round.");

  // block disqualified users
  if (g.disqualified.includes(tgId)) {
    return ctx.reply("❌ You are disqualified for the next round due to a false Bingo claim.");
  }

  // move stake to pot
  p.wallet -= stake;
  p.playWallet += stake;
  await p.save();
  g.pot += stake;
  if (!g.players.includes(tgId)) g.players.push(tgId);
  await g.save();

  await ctx.reply(`You joined stake ${stake} ETB. Current players: ${g.players.length}`);
  if (g.status === 'waiting') startCountdown(ctx, g);
}

async function startCountdown(ctx, game) {
  game.status = 'countdown';
  game.countdownEndsAt = new Date(Date.now() + cfg.BREAK_SECONDS*1000);
  game.disqualified = []; // reset each round
  await game.save();

  const key = String(game.stake);
  if (timers.has(key)) clearInterval(timers.get(key));
  let remaining = cfg.BREAK_SECONDS;
  await ctx.telegram.sendMessage(ctx.chat.id, `Next round (stake ${game.stake}) starts in ${remaining}s`);
  const id = setInterval(async () => {
    remaining -= 5;
    if (remaining <= 0) {
      clearInterval(id);
      timers.delete(key);
      runRound(ctx, game.stake);
      return;
    }
    try {
      await ctx.telegram.sendMessage(ctx.chat.id, `Starting in ${remaining}s`);
    } catch(e){}
  }, 5000);
  timers.set(key, id);
}

async function runRound(ctx, stake) {
  let g = await Game.findOne({ stake, status: 'countdown' });
  if (!g || g.players.length === 0) {
    if (g) { g.status='waiting'; await g.save(); }
    return ctx.telegram.sendMessage(ctx.chat.id, `Not enough players for stake ${stake}. Waiting...`);
  }
  g.status = 'running';
  g.calledNumbers = [];
  await g.save();

  const seq = generateBingoSequence();
  for (const n of seq) {
    g.calledNumbers.push(n);
    await g.save();
    await ctx.telegram.sendMessage(ctx.chat.id, `Number: *${n}*`, { parse_mode: 'Markdown' });
    const fresh = await Game.findById(g._id);
    if (fresh.status !== 'running') return; // stopped
    await new Promise(r => setTimeout(r, cfg.CALL_INTERVAL_MS));
  }
  await endRoundNoWinner(ctx, g);
}

async function claimBingo(ctx) {
  const tgId = String(ctx.from.id);
  const running = await Game.findOne({ status: 'running', players: tgId });
  if (running) {
    running.status = 'ended';
    running.winnerTgId = tgId;
    await running.save();
    return settlePayout(ctx, running);
  }

  // false claim
  if (await isAntiCheatOn()) {
    const recent = await Game.findOne({ status: { $in: ['waiting','countdown'] } }).sort({ updatedAt: -1 });
    if (recent) {
      if (!recent.disqualified.includes(tgId)) {
        recent.disqualified.push(tgId);
        await recent.save();
      }
      await ctx.reply("❌ False Bingo! You are disqualified for the next round.");
    } else {
      await ctx.reply("❌ False Bingo!");
    }
  } else {
    await ctx.reply("No active round for you.");
  }
}

async function endRoundNoWinner(ctx, g) {
  g.status = 'ended';
  await g.save();
  await ctx.telegram.sendMessage(ctx.chat.id, `Round ended. No valid Bingo. Pot rolls to next round.`);
  for (const pid of g.players) {
    const p = await Player.findOne({ tgId: pid });
    if (!p) continue;
    p.wallet += g.stake;
    if (p.playWallet >= g.stake) p.playWallet -= g.stake;
    await p.save();
  }
}

async function settlePayout(ctx, g) {
  const winner = await Player.findOne({ tgId: g.winnerTgId });
  if (!winner) return;

  const adminCut = Number((g.pot * cfg.COMMISSION_PCT / 100).toFixed(2));
  const jackpotCut = Number((g.pot * cfg.JACKPOT_PCT / 100).toFixed(2));
  const winnerPay = Number((g.pot * cfg.WINNER_PCT / 100).toFixed(2));

  winner.wallet += winnerPay;
  winner.wins += 1;
  winner.earnings += winnerPay;
  await winner.save();

  await Tx.create({ tgId: winner.tgId, type: 'payout', amount: winnerPay, status: 'done', note: `Stake ${g.stake}` });
  await Tx.create({ tgId: 'ADMIN', type: 'commission', amount: adminCut, status: 'done' });
  await Tx.create({ tgId: 'JACKPOT', type: 'jackpot', amount: jackpotCut, status: 'done' });

  g.jackpotPool += jackpotCut;
  await g.save();

  await ctx.telegram.sendMessage(ctx.chat.id, `🎉 Winner: ${winner.name || winner.username || winner.tgId}\nPayout: ${winnerPay} ${cfg.BASE_CURRENCY}`);
}

function playerMenu(ctx) {
  return ctx.reply("Menu / ምናሌ", Markup.inlineKeyboard([
    [ Markup.button.callback('Buy Card / ካርድ ግዢ','BUY'), Markup.button.callback('Balance / ቀሪ ብር','BAL') ],
    [ Markup.button.callback('Deposit / ተቀማጭ','DEP'), Markup.button.callback('Withdraw / ማውጣት','WIT') ],
    [ Markup.button.callback('Rules / ህጎች','RULES'), Markup.button.callback('My Wins / አሸናፊነቴ','WINS') ],
    [ Markup.button.callback('Game History / ታሪክ','HIST'), Markup.button.callback('Next Game / የሚቀጥለው','NEXT') ],
    [ Markup.button.callback('Help / እርዳታ','HELP') ]
  ]));
}

module.exports = { joinGame, claimBingo, playerMenu };

