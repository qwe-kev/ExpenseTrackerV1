const path = require('path');
const rootDir = path.dirname(require.main.filename);
const User = require('../models/user');
const Expense = require('../models/expense');
const S3 = require('aws-sdk/clients/s3');
require('dotenv').config();

let isPremium;

module.exports.showindex = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'index.html'))
}

module.exports.getExpenses = (req, res, next) => {
    User.findByPk(req.user.userId)
    .then(user => {
        isPremium = user.isPremium;
    })
    Expense.findAll({where : {userId : req.user.userId}})
    .then(expenses => {
        res.status(200).json({expenses : expenses, userPlan : isPremium});
    })
}

module.exports.deleteExpense = (req, res, next) => {
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
}

module.exports.editExpense = (req, res, next) => {
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
}

module.exports.addExpense =  (req, res, next) => {
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
}

const uploadToS3 = async function(data, filename) {
    try {
        const BUCKET_NAME = process.env.AWS_BUCKET
        const region = process.env.AWS_REGION
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

        const s3 = new S3({
            region,
            accessKeyId,
            secretAccessKey
         });

        const uploadParams = {
            Bucket : BUCKET_NAME,
            Body : data,
            Key : filename,
            ACL : 'public-read'
        };

        return s3.upload(uploadParams).promise()
    }
    catch(err) {
        console.log(err);
    }
    
}

module.exports.downloadExpenses = async(req, res, next) => {
    try{
        const userId = req.user.userId;
        const expenses = await Expense.findAll(
            {where : {userId : userId}}
        )
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `Expense${req.user.userId}${new Date()}.txt`
        const fileUrl = await uploadToS3(stringifiedExpenses, fileName);
        res.status(200).json({fileUrl : fileUrl, message : 'success'});
    }
    catch(err) {
        return res.status(500).json({fileUrl : '', error : err});
    }
   
}