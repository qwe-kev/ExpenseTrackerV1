const Order = require('../models/order');
const User = require('../models/user');
const RazorPay = require('razorpay');

module.exports.purchasePremium = (req, res, next) => {
    try {
        const rzp = new RazorPay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_SECRET_KEY
        })
        const amount = 2500;
        rzp.orders.create({amount, currency : 'INR'}, (err, order) => {
            if(err) {
                console.log(err)
                throw new Error(JSON.stringify(err));
            }
            
           Order.create({
            orderId : order.id,
            status : "pending",
            userId : req.user.userId
           })
            .then(() => {
                return res.status(201).json({order, key_id : rzp.key_id})
            })
            .catch((err) => {
                throw new Error(err);
            })
        })
    }
    catch(err) {
        res.status(403).json({message : "Something went wrong", error : err});
    }
}

exports.updateTransactionStatus = (req, res, next) => {
    try{
        const {payment_id, order_id} = req.body;
        Order.findAll({
            where: {
              orderId: order_id
            }
          })
        .then((order) => {
            order = order[0];
            order.paymentId = payment_id;
            order.status = "Successfull";
            return order.save();
        })
        .then(result => {
            return User.findByPk(req.user.userId);
        })
        .then(user => {
            user.isPremium = true;
            return user.save();
        })
        .then(result => {
            return res.status(202).json({message : 'Transaction successfull'});
        })
        .catch(err => {
            throw new Error(err);
        })
    }
    catch(err) {
        console.log(err);
        throw new Error(err);
    }  
}
