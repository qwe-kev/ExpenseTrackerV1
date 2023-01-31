const path = require('path');
const rootDir = path.dirname(require.main.filename);
const User = require('../models/user');
const ForgotPasswordRequest = require('../models/ForgotPasswordRequests');
const bcrypt = require('bcrypt');
const Sib = require('sib-api-v3-sdk');
const {v4 : uuidv4} = require('uuid');
let requestId;
let recepientEmail;

const saltRounds = 10;

const hashPassword = async function(password) {
    return await bcrypt.hash(password, saltRounds);
}

module.exports.forgotPassword = async(req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'forgotPassword.html'))
}

module.exports.postForgotPassword = async(req, res, next) => {
    try {
        const email = req.body.email;

        const requestId = uuidv4();
            
        recepientEmail = await User.findOne({where : {email : email}});

        if(!recepientEmail) {
            res.status(404).json({status : 404, message : "please provide your registered email"})
        }


        const resetRequest = await ForgotPasswordRequest.create({
            id : requestId,
            isactive : true,
            userId : recepientEmail.dataValues.id
        })

        const client = Sib.ApiClient.instance;

        const apiKey = client.authentications['api-key'];

        apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;

        const transEmailApi = new Sib.TransactionalEmailsApi()

        const sender = {
            email : 'kevray39@gmail.com',
            name : 'Kevin'
        }

        const recievers = [
        {
            email : `${email}`
        },
        ]
        
        const emailResponse = await transEmailApi.sendTransacEmail({
            sender,
            To : recievers,
            subject : 'Password reset link',
            textContent : 'hey  here to reset your password',
            htmlContent : `<h1>Your password reset link<h1>
            <a href="http://localhost:3000/password/resetpassword/{{params.requestId}}">click here to reset your password</a>`,
            params : {
                requestId : requestId
            }
        })

        res.status(200).json({status : 200, message : "check your mailbox for reset link"});
    }
    catch(err) {
        console.log(err);
        res.status(409).json({message : "failed changing password"})
    }
 }

 module.exports.getresetPasswordForm = (req, res, next) => {
    requestId = req.params.requestId;
    res.sendFile(path.join(rootDir, 'views', "resetPassword.html"))
 }

 module.exports.updatePassword = async (req, res, next) => {
    try {
        const password = req.body.password;
        const checkResetRequest = await ForgotPasswordRequest.findOne({where : {id : requestId}});
        if(checkResetRequest) {
           const result = await ForgotPasswordRequest.update(
            {isactive : false},
            {where : {id : requestId}}
           )
            const newPassword = await hashPassword(password);
            const user = await User.update(
            {password : newPassword},
            {where : {email : recepientEmail.dataValues.email}}
            )
            res.status(200).json({status : 200, message : "successfully changed password"});
        }
        else {
            throw new Error("request for a new reset link");
        }
    }
    catch(err) {
        console.log(err);
        res.status(409).json({status:409, message : "failed to change password"});
    }
 }