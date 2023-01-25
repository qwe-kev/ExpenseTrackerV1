const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = path.dirname(require.main.filename);
const users = [];
const sequelize = require('../util/database');
const User = require('../models/user');

router.get('/signUp', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'register.html'))
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
        res.status(200).redirect('/users/login');
    })
    .catch(err => {
        res.status(409).json({status : 409, message : err});
    })
})

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    return User.findAll({
       where : {
        'email' : email
       }
    })
    .then((user) => {
        if(user.length > 0) {
            return User.findAll({
                where : {
                 'email' : email,
                 'password' : password
                }
             })
        }
        else{
            res.json({status : 404, message : "User not found"});
        }
    })
    .then(user => {
        if(user.length > 0) {
            res.json({status :200, message : "Successfully logged in", user})
        }
        else {
            res.json({status : 401, message : "User not authorized"});
        }
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })
})

module.exports = router;