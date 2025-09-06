// src/bingo-backend/routes/players.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Players route is working ✅');
});

export default router;
