// utils/pendingPayments.js
const pendingPayments = {};

function logPendingPayment(playerId, amount) {
  pendingPayments[playerId] = { amount, approved: false };
}

function approvePayment(playerId) {
  if (pendingPayments[playerId]) {
    pendingPayments[playerId].approved = true;
    return pendingPayments[playerId];
  }
  return null;
}

function getPendingPayments() {
  return pendingPayments;
}

module.exports = { logPendingPayment, approvePayment, getPendingPayments };
