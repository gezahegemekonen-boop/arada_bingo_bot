exports.handleApprove = async (bot, msg, match) => {
  const txId = match[1];
  // Call backend to approve transaction
  await fetch(`${process.env.BACKEND_URL}/admin/approve`, {
    method: 'POST',
    headers: { 'x-admin-token': process.env.ADMIN_SECRET },
    body: JSON.stringify({ txId }),
  });
  bot.sendMessage(msg.chat.id, `✅ Approved transaction ${txId}`);
};

