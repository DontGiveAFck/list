const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.set('view engine', 'ejs');
//app.use(express.static('views'));

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/views'));

app.use('/', require('./src/routes/main'));
app.use('/profile', require('./src/routes/profile'));
app.use('/signup', require('./src/routes/signup'));
app.use('/task', require('./src/routes/task'));


app.listen(3000, () => {
    console.log("server started on port 3000");
});

