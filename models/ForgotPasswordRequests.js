const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ForgotPasswordRequest = sequelize.define('ForgotPasswordRequests', {
    id : {
        type : Sequelize.STRING,
        primaryKey : true,
        allowNull : false
    },
    isactive : {
        type : Sequelize.BOOLEAN,
        allowNull : false
    }
})

module.exports = ForgotPasswordRequest;