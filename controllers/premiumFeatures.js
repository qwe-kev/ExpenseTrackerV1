const Expense = require('../models/expense');
const User = require('../models/user');

module.exports.showLeaderboard = (req, res, next) => {
    try{
        let expenseTotal = new Map();
        Expense.findAll()
        .then(expenses => {
            if(expenses.length === 0) {
                return res.status(404).json({message : "oops, try again later!"})
            }
            expenses.forEach(expense => {
                if(expenseTotal.has(expense.dataValues.userId)) {
                    expenseTotal.set(expense.dataValues.userId, expenseTotal.get(expense.dataValues.userId) + expense.dataValues.amount);
                }
                else{
                    expenseTotal.set(expense.dataValues.userId, expense.dataValues.amount);
                }
            });
            return expenseTotal;
            })
        .then(result => {
            let unsortedList = [...result];
            let sortedList = unsortedList.sort(function(a, b) {
                return a[0] - b[0];
              });
            User.findAll()
            .then(users => {
                let count = 0;
                users.forEach(user => {
                    sortedList[count][0] = user.dataValues.name;
                    count++;
                })
                const leaderboardResult = sortedList.sort(function(a, b) {
                    return b[1] - a[1];
                  });
                res.status(200).json({leaderboard : leaderboardResult});
            })
        })
    }
    catch(err) {
        console.log(err);
        return res.status(404).json(err);
    }
}
