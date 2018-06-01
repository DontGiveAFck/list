const express = require('express');
const database = require('./src/database');
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

app.get('/', (req, res) => {

    console.log(req.session.userId);
    if(!(req.session.userId == undefined)) {
        // logged
        console.log('already logged');
        res.redirect('/profile');
    } else {

        res.render('index');
    }
});

app.post('/', (req, res) => {

    req.session.userId = undefined;
    res.render('index');
});

app.get('/signup', (req, res) => {

    if(!(req.session.userId == undefined)) {
        // logged
        res.redirect('/profile')
    } else {
        res.render('signup', {answer: ""});
    }
});

app.post('/signup', (req, res) => {

    if(!(req.session.userId == undefined)) {
        // logged
        res.redirect('/profile');
    } else {
        database.signup(req, res);
    }

});

app.get('/profile', (req, res) => {

    if(!(req.session.userId == undefined)) {
        //res.render('profile', {userName: req.session.userName});
        if(req.query.title == undefined) {

            if(req.query.page == undefined) {
                req.query.page = 1;
            }

            database.getAllTasks(req, res);
        } else {
            database.getTasksByTitle(req, res, req.query.title);
        }
    } else {
        res.redirect('/');
    }

});

app.post('/profile', (req, res) => {

    console.log(req.session.userName);

    if(req.query.page == undefined)
        req.query.page = 1;

    database.signin(req, res);
    console.log(req.body);


});

app.get('/addtask',(req, res) => {

    res.render('addtask');
});

app.post('/addtask', (req, res) => {

    database.addTask(req, res);
});

app.post('/removetask', (req, res) => {

    database.removeTask(req, res);
});




app.listen(3000, () => {
    console.log("server started");
});

