const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');

router.get('/forgotpassword', forgotPasswordController.forgotPassword);

router.post('/forgotpassword', forgotPasswordController.postForgotPassword);

router.get('/resetpassword/:requestId', forgotPasswordController.getresetPasswordForm);

router.post('/resetpassword', forgotPasswordController.updatePassword);

module.exports = router;