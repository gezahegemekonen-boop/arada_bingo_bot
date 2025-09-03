const express = require('express');
const router = express.Router();

// ✅ GET /health — basic server check
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Arada Bingo backend is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
