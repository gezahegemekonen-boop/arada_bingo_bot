import dotenv from 'dotenv';
dotenv.config();

// Split and sanitize admin IDs
const allowedAdmins = (process.env.ADMIN_CHAT_IDS || '')
  .split(',')
  .map(id => id.trim())
  .filter(id => id.length > 0);

export const isAdmin = (chatId) => {
  const isAllowed = allowedAdmins.includes(chatId.toString());
  
  // Optional: log unauthorized attempts for debugging
  if (!isAllowed) {
    console.warn(`Unauthorized access attempt from chat ID: ${chatId}`);
  }

  return isAllowed;
};
