exports.handleReject = async (bot, msg, match) => {
  const txId = match[1];
  await fetch(`${process.env.BACKEND_URL}/admin/reject`, {
    method: 'POST',
    headers: { 'x-admin-token': process.env.ADMIN_SECRET },
    body: JSON.stringify({ txId }),
  });
  bot.sendMessage(msg.chat.id, `❌ Rejected transaction ${txId}`);
};

