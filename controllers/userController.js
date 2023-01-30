const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = path.dirname(require.main.filename);
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const hashPassword = async function(password) {
    return await bcrypt.hash(password, saltRounds);
}

const generateToken = function(id, email) {
    return jwt.sign({userId : id, email}, process.env.SECRET_KEY, {expiresIn : "24h"});
}

const checkUser = async function(password, hash) {
    return new Promise((resolve, reject) => {
        resolve(bcrypt.compare(password, hash));
    })
}

module.exports.signUp = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'register.html'))
}

module.exports.login = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'login.html'))
}

module.exports.forgotPassword = async(req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'forgotPassword.html'))
}

module.exports.newUser = (req, res, next) => {
    const password = req.body.password;
    hashPassword(password)
    .then((hashedPassword) => {
        return User.create({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword
        })
    })
    .then(user => {
        res.status(200).redirect('/users/login');
    })
    .catch(err => {
        res.status(409).json({status : 409, message : err});
    })
}

module.exports.loginUser = (req, res, next) => {
    let userId;
    let verifiedUser;
    const email = req.body.email;
    const password = req.body.password;
    return User.findAll({
       where : {
        'email' : email
       }
    })
    .then((user) => {
        if(user.length > 0) {
            verifiedUser = user[0].dataValues;
            return checkUser(password, user[0].dataValues.password);
        }
        else{
            res.json({status : 404, message : "User not found"});
        }
    })
    .then(result => {
        if(result) {
            res.json({status :200, message : "Successfully logged in", token : generateToken(verifiedUser.id, verifiedUser.email)});
        }
        else {
            res.json({status : 401, message : "User not authorized"});
        }
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })
}

 module.exports.postForgotPassword = async(req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const newPassword = await hashPassword(password);
        const user = await User.update(
            {password : newPassword},
            {where : {email : email}}
        )
        res.status(200).json({status : 200, message : "successfully changed password"});
    }
    catch(err) {
        console.log(err);
        res.status(409).json({message : "failed changing password"})
    }
 }