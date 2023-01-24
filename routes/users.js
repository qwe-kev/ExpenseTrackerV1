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

router.get('/login', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'login.html'))
})

router.post('/createUser', (req, res, next) => {
    return User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    })
    .then(user => {
        //res.send(user);
        res.sendFile(path.join(rootDir, 'views', 'login.html'))
    })
    .catch(err => {
        console.log(err);
        res.sendFile(path.join(rootDir, 'views', 'signUpError.html'))
    })
})

router.post('/users/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);
    return User.findAll({
       where : {
        'email' : email,
        'password' : password
       }
    })
    .then((user) => {
        console.log("user", user);
        if(user.length > 0) {
            res.send('<h1>Success<h1>')
        }
        else{
            res.send('<h1>No user Found!!!</h1>')
        }
    })
    .catch(err => {
        console.log(err);
    })
})

module.exports = router;