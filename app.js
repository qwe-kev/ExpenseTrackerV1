const express = require('express');

const app = express();

const sequelize = require('./util/database');

app.set('views', 'views');

const userRoutes = require('./routes/users');

app.use(express.static("public"));
app.use(express.json());

app.use(express.urlencoded({extended : true}))

app.use('/', userRoutes); 

app.use('/users', userRoutes)

sequelize.sync()
.then(() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})
