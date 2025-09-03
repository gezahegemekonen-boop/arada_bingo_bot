const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend running', timestamp: new Date().toISOString() });
});

module.exports = router;
