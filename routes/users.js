const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = path.dirname(require.main.filename);
const users = [];
const sequelize = require('../util/database');
const User = require('../models/user');

router.get('/signUp', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'index.html'))
})

router.post('/createUser', (req, res, next) => {
    return User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    })
    .then(user => {
        res.sendFile(path.join(rootDir, 'views', 'login.html'))
    })
    .catch(err => {
        console.log(err);
        res.sendFile(path.join(rootDir, 'views', 'signUpError.html'))
    })
})

module.exports = router;