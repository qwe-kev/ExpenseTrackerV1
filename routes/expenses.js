const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const premiumFeaturesController = require('../controllers/premiumFeatures');
const expenseControllers = require('../controllers/expenseControllers');

router.get('/index.html', expenseControllers.showindex);

router.get('/getExpenses',verifyToken, expenseControllers.getExpenses);

router.get('/deleteExpense', verifyToken, expenseControllers.deleteExpense);

router.get('/editExpense', verifyToken, expenseControllers.editExpense);

router.post('/addExpense', verifyToken, expenseControllers.addExpense);

router.get('/getLeaderboard', premiumFeaturesController.showLeaderboard);

router.get('/downloadExpenses', verifyToken, expenseControllers.downloadExpenses);

router.get('/getReports', verifyToken, expenseControllers.getReport);

module.exports = router;