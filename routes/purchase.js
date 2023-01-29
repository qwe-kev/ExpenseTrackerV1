const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = path.dirname(require.main.filename);
const User = require('../models/user');
const Expense = require('../models/expense');
const verifyToken = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.get('/premiummembership', verifyToken, orderController.purchasePremium);

router.post('/updateTransactionStatus', verifyToken, orderController.updateTransactionStatus);

module.exports = router;