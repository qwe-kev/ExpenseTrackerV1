const express = require('express');

require('dotenv').config();

const sequelize = require('./util/database');

const User = require('./models/user');

const Expense = require('./models/expense');

const Order = require('./models/order');

const ForgotPasswordRequest = require('./models/ForgotPasswordRequests');

const auth = require('./middleware/auth');

const cors = require('cors')
 
const app = express();

app.use(cors())

const {API_PORT} = process.env;

const port = process.env.PORT || API_PORT;

app.set('views', 'views');

const userRoutes = require('./routes/users');

const expenseRoutes = require('./routes/expenses');

const purchaseRoutes = require('./routes/purchase')

const forgotPasswordRoutes = require('./routes/forgotpassword');

app.use(express.static("public"));

app.use(express.json());

app.use(express.urlencoded({extended : true}))

app.use('/', userRoutes);

app.use('/password', forgotPasswordRoutes);

app.use('/users/password', userRoutes);

app.use('/users', userRoutes)

app.use('/expenses', expenseRoutes);

app.use('/purchase', purchaseRoutes);

Expense.belongsTo(User);

User.hasMany(Expense);

Order.belongsTo(User);

User.hasMany(Order);

ForgotPasswordRequest.belongsTo(User);

User.hasMany(ForgotPasswordRequest);

sequelize.sync()
.then(() => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    });
})
.catch(err => {
    console.log(err);
})
