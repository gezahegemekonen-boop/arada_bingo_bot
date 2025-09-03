import express from 'express';
import { getAllPlayers, getPlayer, updatePlayer } from '../controllers/playController.js';

const router = express.Router();

router.get('/', getAllPlayers);
router.get('/:id', getPlayer);
router.put('/:id', updatePlayer);

export default router;
