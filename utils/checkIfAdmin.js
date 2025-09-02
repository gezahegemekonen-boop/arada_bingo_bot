// utils/checkIfAdmin.js

const ADMIN_IDS = [
  '123456789', // Replace with real Telegram user IDs
  '987654321'
];

function checkIfAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}

module.exports = checkIfAdmin;
