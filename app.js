const express = require('express');

require('dotenv').config();

const sequelize = require('./util/database');

const User = require('./models/user');

const Expense = require('./models/expense');

const auth = require('./middleware/auth');

const app = express();

const {API_PORT} = process.env;

const port = process.env.PORT || API_PORT;

app.set('views', 'views');

const userRoutes = require('./routes/users');

const expenseRoutes = require('./routes/expenses');

app.use(express.static("public"));

app.use(express.json());

app.use(express.urlencoded({extended : true}))

app.use('/', userRoutes); 

app.use('/users', userRoutes)

app.use('/expenses', expenseRoutes);

Expense.belongsTo(User, {constraints : true, onDelete : 'CASCADE'});

User.hasMany(Expense);

sequelize.sync()
.then(() => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    });
})
.catch(err => {
    console.log(err);
})
