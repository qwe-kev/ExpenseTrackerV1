const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = path.dirname(require.main.filename);
const User = require('../models/user');
const Expense = require('../models/expense');
const verifyToken = require('../middleware/auth');

let isPremium;

router.get('/index.html', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'index.html'))
})

router.get('/getExpenses',verifyToken, (req, res, next) => {
    User.findByPk(req.user.userId)
    .then(user => {
        isPremium = user.isPremium;
    })
    Expense.findAll({where : {userId : req.user.userId}})
    .then(expenses => {
        res.status(200).json({expenses : expenses, userPlan : isPremium});
    })
})

router.get('/deleteExpense', verifyToken, (req, res, next) => {
    const id = req.query.id;
    Expense.findByPk(id)
    .then(expense => {
        console.log("found expense", expense);
        return expense.destroy();
    })
    .then(result => {
        res.status(200).json({"message" : "Successfully deleted expense"});
    })
    .catch(err => {
        console.log(err);
    })
})

router.get('/editExpense', verifyToken, (req, res, next) => {
    const id = req.query.id;
    const {amount, description, category} = req.query.expenseItem;
    Expense.findByPk(id)
    .then(expense => {
        expense.amount = amount;
        expense.description = description;
        expense.category = category;
        return expense.save();
    })
    .then(result => {
        res.status(200).json({"message" : "successfully edited expense"});
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })
})

router.post('/addExpense', verifyToken, (req, res, next) => {
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const userId = req.user.userId;

    Expense.create({
        amount : amount,
        description : description,
        category : category,
        userId : userId
    })
    .then(expense => {
        res.status(200).json({"expense Item" : expense, "message" : "Successfully added expense"})
    })
    .catch(err => {
        res.send(err);
        console.log(err);
    })
})

module.exports = router;