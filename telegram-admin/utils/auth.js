import dotenv from 'dotenv';
dotenv.config();

const allowedAdmins = process.env.ADMIN_CHAT_IDS?.split(',') || [];

export const isAdmin = (chatId) => {
  return allowedAdmins.includes(chatId.toString());
};
