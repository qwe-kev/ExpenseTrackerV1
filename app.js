const express = require('express');
const app = express();
const userRoutes = require('./routes/signup');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

app.post('/', userRoutes);

app.get('/', userRoutes);

app.set('views', 'views');

app.listen('3000', () => {
    console.log("open on 3000");
})