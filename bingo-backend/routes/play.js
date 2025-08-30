// routes/play.js

const express = require('express');
const router = express.Router();
const generateCard = require('../helpers/generateCard');

router.post('/play', (req, res) => {
  const { userId } = req.body;

  if (!userId || typeof userId !== 'string' || userId.length < 5) {
    return res.status(400).json({ error: 'Invalid or missing userId' });
  }

  const card = generateCard();
  res.json({ userId, card, message: 'Game started' });
});

module.exports = router;

