require('dotenv').config();
const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const { connectDB } = require('./db');
const Player = require('./models/Player');
const Tx = require('./models/Tx');
const Game = require('./models/Game');
const Setting = require('./models/Setting');
const cfg = require('./config');
const { joinGame, claimBingo, playerMenu } = require('./game');
const { adminMenu, financeReport, isAdmin, listPendings, handleApprove, handleReject } = require('./admin');

const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (_, res)=>res.send('OK'));
app.listen(PORT, ()=>console.log("Health server on", PORT));

const bot = new Telegraf(process.env.BOT_TOKEN);
if (!process.env.BOT_TOKEN) { console.error("Missing BOT_TOKEN"); process.exit(1); }

// --- START ---
bot.start(async (ctx) => {
  await connectDB();
  const tgId = String(ctx.from.id);
  let p = await Player.findOne({ tgId });
  if (!p) {
    p = await Player.create({
      tgId,
      name: ctx.from.first_name || '',
      username: ctx.from.username || ''
    });
  }
  const ref = ctx.startPayload;
  if (ref && ref !== tgId && !p.referredBy) {
    p.referredBy = ref;
    await p.save();
  }
  await ctx.reply(cfg.LOCALE_WELCOME_AM);
  return playerMenu(ctx);
});

// --- HELP ---
bot.help((ctx)=> ctx.reply("Use the menu buttons. Buy card, deposit, withdraw, rules, etc."));

// --- ADMIN ---
bot.command('admin', adminMenu);
bot.action('ADM_FIN', financeReport);
bot.command('pendings', listPendings);
bot.action(/^ADM_APPR_(.+)$/, async (ctx) => handleApprove(ctx, ctx.match[1]));
bot.action(/^ADM_REJ_(.+)$/, async (ctx) => handleReject(ctx, ctx.match[1]));

// --- Player Menu ---
bot.action('BUY', async (ctx)=>{
  const row = cfg.STAKES.map(s => Markup.button.callback(`${s} ETB`, `BUY_${s}`));
  const kb = [];
  for (let i=0; i<row.length; i+=3) kb.push(row.slice(i,i+3));
  return ctx.reply("Choose stake", Markup.inlineKeyboard(kb));
});
cfg.STAKES.forEach(stake => {
  bot.action(`BUY_${stake}`, (ctx)=> joinGame(ctx, stake));
});
bot.action('BAL', async (ctx)=>{
  const p = await Player.findOne({ tgId: String(ctx.from.id) });
  const msg = `Wallet: ${p?.wallet||0} ${cfg.BASE_CURRENCY}\nPlay Wallet: ${p?.playWallet||0} ${cfg.BASE_CURRENCY}`;
  return ctx.reply(msg);
});
bot.action('DEP', (ctx)=> ctx.reply("Deposit: /deposit AMOUNT METHOD REF (min 50 ETB)"));
bot.command('deposit', async (ctx)=>{
  const [_, amount, method='other', txref='-'] = ctx.message.text.split(' ');
  const a = Number(amount);
  if (!a || a < 50) return ctx.reply("Minimum deposit is 50 ETB. Usage: /deposit 100 CBE 12345");
  await Tx.create({ tgId: String(ctx.from.id), type: 'deposit', amount: a, method, status: 'pending', note: txref });
  return ctx.reply("Deposit submitted. Admin will approve soon.");
});
bot.action('WIT', (ctx)=> ctx.reply("Withdraw: /withdraw AMOUNT"));
bot.command('withdraw', async (ctx)=>{
  const [_, amount] = ctx.message.text.split(' ');
  const a = Number(amount);
  const p = await Player.findOne({ tgId: String(ctx.from.id) });
  if (!a || a < 50) return ctx.reply("Minimum withdraw is 50 ETB. Usage: /withdraw 200");
  if (!p || p.wallet < a) return ctx.reply("Insufficient wallet balance.");
  await Tx.create({ tgId: p.tgId, type: 'withdraw', amount: a, status: 'pending' });
  return ctx.reply("Withdraw request submitted.");
});
bot.action('RULES', (ctx)=> ctx.reply("Rules: 100 cards. Numbers every ~2s. Patterns: row/diagonal/corners. False Bingo → disqualified if anti-cheat ON."));
bot.action('WINS', async (ctx)=>{
  const p = await Player.findOne({ tgId: String(ctx.from.id) });
  return ctx.reply(`Wins: ${p?.wins||0}\nEarnings: ${p?.earnings||0} ${cfg.BASE_CURRENCY}`);
});
bot.action('HIST', async (ctx)=>{
  const txs = await Tx.find({ tgId: String(ctx.from.id) }).sort({createdAt:-1}).limit(5);
  let msg = txs.length ? txs.map(t=>`${t.type} ${t.amount} ${t.status}`).join('\n') : 'No history yet.';
  return ctx.reply(msg);
});
bot.action('NEXT', async (ctx)=>{
  const actives = await Game.find({ status: { $in: ['countdown','waiting'] } });
  const msg = actives.length ? actives.map(g=>`Stake ${g.stake}: ${g.status}`).join('\n') : 'No scheduled rounds.';
  return ctx.reply(msg);
});
bot.action('HELP', (ctx)=> ctx.reply("Need help? Use menu buttons or contact admin."));

// --- GAME ACTIONS ---
bot.command('bingo', claimBingo);

// --- DAILY BONUS ---
bot.command('daily', async (ctx)=>{
  const p = await Player.findOne({ tgId: String(ctx.from.id) });
  const now = new Date();
  if (p.lastDailyBonusAt && (now - p.lastDailyBonusAt) < 24*60*60*1000) return ctx.reply("Already claimed today.");
  p.lastDailyBonusAt = now;
  p.wallet += cfg.DAILY_BONUS_ETB;
  await p.save();
  await Tx.create({ tgId: p.tgId, type: 'daily', amount: cfg.DAILY_BONUS_ETB, status: 'done' });
  return ctx.reply(`Daily bonus +${cfg.DAILY_BONUS_ETB} ${cfg.BASE_CURRENCY}`);
});

// --- REFERRALS ---
bot.command('ref', (ctx)=>{
  const link = `https://t.me/${ctx.botInfo.username}?start=${ctx.from.id}`;
  return ctx.reply(`Invite link:\n${link}\nYou get ${cfg.REFERRAL_BONUS_ETB} after their first approved deposit.`);
});

// --- ANTICHEAT TOGGLE ---
bot.command('anticheat', async (ctx)=>{
  if (!isAdmin(ctx)) return;
  const arg = (ctx.message.text.split(' ')[1] || '').toLowerCase();
  if (!['on','off'].includes(arg)) return ctx.reply('Usage: /anticheat on|off');
  await Setting.findOneAndUpdate(
    { key: 'antiCheat' },
    { key: 'antiCheat', value: arg==='on' },
    { upsert: true }
  );
  return ctx.reply(`Anti-cheat is now: ${arg.toUpperCase()}`);
});

// --- LEADERBOARD ---
bot.command('top', async (ctx)=>{
  const top = await Player.find().sort({ earnings: -1 }).limit(10);
  const msg = top.length ? top.map((p,i)=>`${i+1}. ${p.name||p.username||p.tgId}: ${p.earnings}`).join('\n') : 'No winners yet.';
  return ctx.reply(msg);
});

// --- LAUNCH ---
connectDB().then(()=>{
  bot.launch();
  console.log("Bot launched");
});
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

