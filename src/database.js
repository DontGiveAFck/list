const mysql = require('mysql');


const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345',
    database : 'todolist'
});

connection.connect();

module.exports = {

    signin: function (req, res) {

        let login = req.body.login;
        let password = req.body.password;
        connection.query('SELECT * FROM users WHERE login = ? AND password = ?', [login, password], (err, results) => {
            if(results.length == 1) {

                req.session.userId = results[0].id;
                req.session.userName = results[0].login;
            } else {
                console.log('Sign in error');
            }
        });
    },

    signup: function (req, res) {

        let login = req.body.login;
        let password = req.body.password;
        let email = req.body.email;

        console.log(req.body);

        //TODO: validation

        connection.query('INSERT INTO users (login, password, email) VALUES(?, ?, ?)', [login, password, email], (err, results) => {
            if (err) throw new Error();

            else {
                res.render('signup', {answer: "Successful! Go to main page"});
            }
        });

    },

    addTask: function (req, res) {

    },

    removeTask: function (req, res) {

    },

};
