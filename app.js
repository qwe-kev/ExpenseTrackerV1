const express = require('express');

const app = express();

const sequelize = require('./util/database');

app.set('views', 'views');

const userRoutes = require('./routes/users');

const expenseRoutes = require('./routes/expenses');

app.use(express.static("public"));

app.use(express.json());

app.use(express.urlencoded({extended : true}))

app.use('/', userRoutes); 

app.use('/users', userRoutes)

app.use('/expenses', expenseRoutes);

sequelize.sync()
.then(() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})
