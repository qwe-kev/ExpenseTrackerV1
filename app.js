const express = require('express');

require('dotenv').config();

const fs = require('fs');

const path = require('path');

const morgan = require('morgan');

const sequelize = require('./util/database');

const User = require('./models/user');

const Expense = require('./models/expense');

const Order = require('./models/order');

const ForgotPasswordRequest = require('./models/ForgotPasswordRequests');

const auth = require('./middleware/auth');

const cors = require('cors')
 
const app = express();

const writeFileStream = fs.createWriteStream(path.join(__dirname, "access.log"), {flags : "a"});

app.use(morgan('combined', {stream : writeFileStream}));

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

User.hasMany(Expense,  { onDelete: 'CASCADE', hooks: true });

Order.belongsTo(User);

User.hasMany(Order,  { onDelete: 'CASCADE', hooks: true });

ForgotPasswordRequest.belongsTo(User);

User.hasMany(ForgotPasswordRequest,  { onDelete: 'CASCADE', hooks: true });

sequelize.sync()
.then(() => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    });
})
.catch(err => {
    console.log(err);
})
