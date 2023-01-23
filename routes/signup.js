const express = require('express');

const Router = express.Router();

const userController = require('../controllers/users');


Router.get('/', userController.getUserSignUp);

Router.post('/', userController.postUser);

module.exports = Router;