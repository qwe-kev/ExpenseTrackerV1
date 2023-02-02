const express = require('express');

const fs = require('fs');

const path = require('path');

const helmet = require('helmet');

const compression = require('compression');

const morgan = require('morgan');

const sequelize = require('./util/database');

const User = require('./models/user');

const Expense = require('./models/expense');

const Order = require('./models/order');

const ForgotPasswordRequest = require('./models/ForgotPasswordRequests');

const auth = require('./middleware/auth');

const cors = require('cors')
 
const app = express();

require('dotenv').config();


app.use(cors())

app.use(helmet({
    contentSecurityPolicy: false
  }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags : 'a'})

app.use(compression())

app.use(morgan('combined', {stream : accessLogStream}))

const port = process.env.API_PORT || 3000;

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

console.log(process.env.NODE_ENV)
sequelize.sync()
.then(() => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    });
})
.catch(err => {
    console.log(err);
})
