const mysql = require('mysql');


const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'asDasD11',
    database : 'todolist'
});
connection.connect();

module.exports = {

    signin: function (req, res) {

        let login = req.body.login;
        let password = req.body.password;

        console.log(req.body);
        connection.query('SELECT * FROM users WHERE login = ? AND password = ?', [login, password], (err, results) => {

            if(results.length == 1) {

                req.session.userId = results[0].id;
                console.log("userId " + req.session.userId);
                req.session.userName = results[0].login;

                this.getAllTasks(req, res);
            } else {

                res.send("<p>Incorrect login or password, please <a href='/'>Try again</a></p>");
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

    getAllTasks: function (req, res) {

        let tableRows = "";
        let userId = req.session.userId;
        let c = connection.query("SELECT * FROM tasks WHERE userId = ?",[userId], function (err, results, fields) {

            console.log(results);

            results.forEach(function (value, index) {

                tableRows += ' <tr> <td>' +  index +  '</td> <td> ' +  results[index].title + ' </td> <td> ' + results[index].text +'</td> <tr>';

            });
        });

        c.on("end", function () {

            res.render('profile', {userName: req.session.userName, data: tableRows});

        });
    },

    addTask: function (req, res) {

        if(req.session.userid == undefined) {
            res.send("<h3>Please, <a href='/'>Sign in</a></h3>");
        }

        // if req.params.itemid != undefined => UPDATE in db

        let con = connection.query("INSERT INTO tasks (title, text, userId) VALUES(?, ?, ?)", [req.body.title, req.body.text, req.session.userId], function (err) {

            if(err) throw err;

            res.send("Task " + data.title + " added!");

        });
    },

    removeTask: function (req, res) {

    },

};
