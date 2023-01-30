const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

module.exports.showLeaderboard = async (req, res, next) => {
    try{
        let leaderboard = [];
        const aggregateExpenses = await User.findAll({
            attributes : ['id', 'name', [sequelize.fn('sum', sequelize.col('amount')), 'total']],
            include : [{
                model : Expense,
                attributes : []
            }],
            group : ['user.id'],
            order: [[sequelize.col('total'), 'DESC']]
        })
        aggregateExpenses.forEach(user => {
            leaderboard.push(user.dataValues)
        });
        res.status(200).json({leaderboard : leaderboard})
    }
    catch(err) {
        console.log(err);
        return res.status(404).json(err);
    }
}
