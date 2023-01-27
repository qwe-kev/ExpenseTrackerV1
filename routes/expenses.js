const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = path.dirname(require.main.filename);
const User = require('../models/user');
const Expense = require('../models/expense');

router.get('/index.html', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'index.html'))
})

router.get('/getExpenses', (req, res, next) => {
    Expense.findAll()
    .then(expenses => {
        res.status(200).json(expenses);
    })
})

router.get('/deleteExpense', (req, res, next) => {
    const id = req.query.id;
    console.log("inside delete router", id);
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

router.get('/editExpense', (req, res, next) => {
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

router.post('/addExpense', (req, res, next) => {
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    console.log("inside router", amount, description, category);
    Expense.create({
        amount : amount,
        description : description,
        category : category
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