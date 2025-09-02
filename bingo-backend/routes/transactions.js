const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getPlayerTransactions);
router.put('/approve/:id', transactionController.approveTransaction);
router.put('/reject/:id', transactionController.rejectTransaction);

module.exports = router;
