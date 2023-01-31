const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/signUp', userController.signUp);

router.get('/login', userController.login);

router.post('/createUser', userController.newUser);

router.post('/login', userController.loginUser);

// router.get('/forgotpassword', userController.forgotPassword);

// router.post('/forgotpassword', userController.postForgotPassword);

module.exports = router;