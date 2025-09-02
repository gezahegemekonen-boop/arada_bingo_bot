import api from '../services/apiClient.js';

export default async function handleCallback(bot, query) {
  const chatId = query.message.chat.id;
  const [action, type, id] = query.data.split('_');

  try {
    if (type === 'tx') {
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      await api.post(`/${endpoint}/${id}`);
      bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
        chat_id: chatId,
        message_id: query.message.message_id
      });
      bot.answerCallbackQuery(query.id, { text: `✅ Deposit ${action}d` });
    }

    if (type === 'round' && action === 'approve') {
      await api.post(`/payout/${id}`);
      bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
        chat_id: chatId,
        message_id: query.message.message_id
      });
      bot.answerCallbackQuery(query.id, { text: '💰 Payout approved' });
    }
  } catch (err) {
    console.error('❌ Callback error:', err.message);
    bot.answerCallbackQuery(query.id, { text: '❌ Action failed' });
  }
}

