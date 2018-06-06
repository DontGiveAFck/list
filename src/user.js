const task = require('./task');
const connection = require('./database');
const bcrypt = require('bcrypt');
const queries = require('./queries');

const saltRounds = 10;

module.exports = {
    signin: function (req, res) {

        let login = req.body.login;
        let password = req.body.password;


        //TODO: validation

        console.log(req.body);

        connection.query(queries.selectFromUsersBylogin, [login], (err, results) => {

            if(results.length == 1) {
                bcrypt.compare(password, results[0].password, (err, valid) => {

                    if (valid == true) {
                        req.session.userId = results[0].id;
                        req.session.userName = results[0].login;

                        task.getAllTasks(req, res);
                    } else {
                        res.send("<p>Incorrect login or password, please <a href='/'>Try again</a></p>");
                    }
                });

            } else {

                res.status(400).send("<p>Incorrect login or password, please <a href='/'>Try again</a></p>");
            }
        });

    },

    signup: function (req, res) {

        let login = req.body.login;
        let password = req.body.password;
        let email = req.body.email;

        bcrypt.hash(password, saltRounds, (err, hash) => {

            if(err) throw err;

            connection.query(queries.insertIntoUsersLoginPasswordEmail, [login, hash, email], (err, results) => {

                if (err) {
                    if (err.code == 'ER_DUP_ENTRY') {
                        res.status(400).send("User with login '" + login + "' or email '" + email + "' already exist.");
                    } else {
                        throw err;
                    }
                } else {
                    res.render('signup', {answer: "Successful! Go to main page"});
                }
            });
        });

    }
};