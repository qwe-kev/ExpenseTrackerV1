const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('orders', {
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true 
    },
    paymentId : {
        type : Sequelize.STRING
    },
    orderId : {
        type : Sequelize.STRING,
    },
    status : {
        type : Sequelize.STRING,
    }
})

module.exports = Order;

