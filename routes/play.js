const express = require('express');
const router = express.Router();
const generateCard = require('../helpers/generateCard');

router.post('/play', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const card = generateCard();
  res.json({ userId, card, message: 'Game started' });
});

module.exports = router;
