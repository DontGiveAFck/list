const mysql = require('mysql');
const htmlspecialchars = require('htmlspecialchars');
const config = require('./config');


let connection = mysql.createConnection(config);

connection.connect((err) => {

    if (err) {
        console.log(err);

        if (err.code == 'ER_ACCESS_DENIED_ERROR') {
            console.log("Error: Access denied to MySQL server.");
            return;
        }

        if (err.code == 'ER_BAD_DB_ERROR') {

            console.error('Error: No connection to DB, trying create database and tables...');

            connection = mysql.createConnection({
                host     : config.host,
                user     : config.user,
                password : config.password
            });

            connection.query("SHOW DATABASES", (err, results) => {

                console.log(results);


            });

            connection.query("create database todolist", (err) => {

                if (err) {
                    console.log("Error: Can't create DATABASE 'todolist'");
                    console.log(err);
                    throw err;
                }

                connection.query("use todolist", (err) => {
                    throw err;

                    console.log("DATABASE 'todolist' created");

                    connection.query("CREATE TABLE users(id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, login VARCHAR(30) NOT NULL, password TEXT NOT NULL, email VARCHAR(50) NOT NULL, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)", (err) => {

                        if (err) {
                            console.log("Error: Can't create TABLE 'users'");
                            throw err;
                        }

                        console.log("TABLE 'users' created");
                        connection.query("CREATE TABLE tasks(id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, title VARCHAR(50) NOT NULL, text TEXT NOT NULL, postDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP", (err) => {

                            if (err) {
                                console.log("Error: Can't create TABLE 'tasks'");
                                throw err;
                            }

                            console.log("TABLE 'tasks' CREATED");
                            console.log("DATABASE and TABLES have been created successful!");

                            connection = mysql.createConnection({
                                host     : config.host,
                                user     : config.user,
                                password : config.password,
                                database : 'todolist'
                            });
                        });
                    });
                });
            });
        }


    } else {
        console.log('connected to DB as id ' + connection.threadId);
    }
});


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
        let pages = "";
        let itemsOnPage = 5;
        let userId = req.session.userId;
        console.log("PAGE: ", req.query.page);
        let from = (Number.parseInt(req.query.page) - 1) * itemsOnPage;
        let c = connection.query("SELECT * FROM tasks WHERE userId = ? LIMIT ? OFFSET ?",[userId, itemsOnPage, from ], function (err, results, fields) {

            console.log(err);

            results.forEach(function (value, index) {

                tableRows += '<tr> <td>' +  (index+1) +  '</td> <td> ' +  htmlspecialchars(results[index].title) + ' </td> <td> ' + htmlspecialchars(results[index].text) + '</td> <td>' + htmlspecialchars(results[index].postDate) + '</td> <tr>';
            });

            let pageNum = Math.ceil(results.length / itemsOnPage);



            for(let i = 1; i <= pageNum; i++) {

                pages += '<li class="page-item"><a class="page-link" href="?page=' + i +'">' + i + '</a></li>';
            }

            console.log(tableRows);
            console.log(pages);
        });

        c.on("end", function () {

            res.render('profile', {userName: htmlspecialchars(req.session.userName), data: tableRows, pages: pages});

        });
    },


    getTasksByTitle: function (req, res, title) {

        let tableRows = "";
        let userId = req.session.userId;
        let c = connection.query("SELECT * FROM tasks WHERE userId = ? AND title = ?",[userId, title], function (err, results, fields) {

            console.log(results);

            results.forEach(function (value, index) {

                tableRows += '<tr> <td>' +  index +  '</td> <td> ' +  htmlspecialchars(results[index].title) + ' </td> <td> ' + htmlspecialchars(results[index].text) + '</td> <td>' + htmlspecialchars(results[index].postDate) + '</td> <tr>';

            });
        });

        c.on("end", function () {

            res.render('profile', {userName: htmlspecialchars(req.session.userName), data: tableRows});

        });
    },

    addTask: function (req, res) {

        if(req.session.userId == undefined) {
            res.send("<h3>Please, <a href='/'>Sign in</a></h3>");
        }

        // if req.params.itemid != undefined => UPDATE in db

        let con = connection.query("INSERT INTO tasks (title, text, userId) VALUES(?, ?, ?)", [req.body.title, req.body.text, req.session.userId], function (err) {

            if(err) throw err;
            else {
                res.send("Task " + htmlspecialchars(req.body.title) + " added!");
            }
        });
    },

    removeTask: function (req, res) {


         let title = req.body.title;
         let userId = req.session.userId;

         let con = connection.query("DELETE FROM tasks WHERE title = ? AND userId = ?", [title, userId], (err, results) => {

             if (err) throw err;

             if(results.length == 0) {
                 res.send("No tasks with title " + htmlspecialchars(title));
             } else {
                 res.send("Tasks with title " + htmlspecialchars(title) + " have been removed. " + '<a href="/profile">Profile</a>');
             }
         });
    },

};
