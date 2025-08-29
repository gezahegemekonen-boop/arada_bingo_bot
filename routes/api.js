const express = require('express');
const router = express.Router();
const { playGame } = require('../game'); // make sure this matches your export

// Example: POST /api/play
router.post('/play', async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await playGame(userId); // reuse your game.js logic
    res.json(result);
  } catch (error) {
    console.error('Error in /api/play:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
