const { Markup } = require('telegraf');
const Player = require('./models/Player');
const Game = require('./models/Game');
const Tx = require('./models/Tx');
const cfg = require('./config');

function isAdmin(ctx) {
  return String(ctx.from.id) === String(process.env.ADMIN_ID);
}

function adminMenu(ctx) {
  if (!isAdmin(ctx)) return ctx.reply("Admins only.");
  return ctx.reply("Admin Menu", Markup.inlineKeyboard([
    [ Markup.button.callback('View Active Games','ADM_ACTIVE') ],
    [ Markup.button.callback('Manage Deposits','ADM_DEPOSITS'), Markup.button.callback('Manage Withdrawals','ADM_WITHDRAWS') ],
    [ Markup.button.callback('Finance Report','ADM_FIN') ],
    [ Markup.button.callback('Pending Tx','ADM_PEND') ],
    [ Markup.button.callback('Announcements','ADM_ANN') ],
    [ Markup.button.callback('Force Stop Game','ADM_FORCESTOP') ]
  ]));
}

// --- Finance Report ---
async function financeReport(ctx) {
  if (!isAdmin(ctx)) return;
  const games = await Game.find({ status: 'ended' }).sort({createdAt:-1}).limit(20);
  let msg = '*Finance Report (recent 20 games)*\\n';
  for (const g of games) {
    const adminCut = Number((g.pot * cfg.COMMISSION_PCT / 100).toFixed(2));
    msg += `Stake: ${g.stake} ETB | Pot: ${g.pot} | Admin: ${adminCut} | Winner: ${g.winnerTgId || '-'}\\n`;
  }
  return ctx.reply(msg);
}

// --- Pendings ---
async function listPendings(ctx) {
  if (!isAdmin(ctx)) return ctx.reply("Admins only.");
  const items = await Tx.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(10);
  if (!items.length) return ctx.reply("No pending transactions.");
  for (const t of items) {
    const line = `${t.type.toUpperCase()} ${t.amount} ${cfg.BASE_CURRENCY} — user ${t.tgId}\\nID: ${t._id}`;
    await ctx.reply(line, Markup.inlineKeyboard([
      [ Markup.button.callback('✅ Approve', `ADM_APPR_${t._id}`),
        Markup.button.callback('⛔ Reject', `ADM_REJ_${t._id}`) ]
    ]));
  }
}

async function handleApprove(ctx, id) {
  if (!isAdmin(ctx)) return;
  const t = await Tx.findById(id);
  if (!t || t.status !== 'pending') return ctx.answerCbQuery("Invalid/handled.");
  if (t.type === 'deposit') {
    const p = await Player.findOne({ tgId: t.tgId });
    if (p) {
      p.wallet += t.amount;
      await p.save();
    }
  }
  t.status = 'approved';
  await t.save();
  await ctx.answerCbQuery("Approved.");
  return ctx.editMessageText(`✅ Approved: ${t.type} ${t.amount} for ${t.tgId}`);
}

async function handleReject(ctx, id) {
  if (!isAdmin(ctx)) return;
  const t = await Tx.findById(id);
  if (!t || t.status !== 'pending') return ctx.answerCbQuery("Invalid/handled.");
  t.status = 'rejected';
  await t.save();
  await ctx.answerCbQuery("Rejected.");
  return ctx.editMessageText(`⛔ Rejected: ${t.type} ${t.amount} for ${t.tgId}`);
}

module.exports = { adminMenu, financeReport, isAdmin, listPendings, handleApprove, handleReject };

