const mysql = require('mysql');
const config = require('./config');

let connection = mysql.createConnection(config);

connection.connect((err) => {

    if (err) {
        console.log(err);

        if (err.code == 'ER_ACCESS_DENIED_ERROR') {
            console.log("Error: Access denied to MySQL server.");

            throw err;
        }

        if (err.code == 'ER_BAD_DB_ERROR') {

            console.error('Error: No connection to DB, trying create database and tables...');

            connection = mysql.createConnection({
                host     : config.host,
                user     : config.user,
                password : config.password
            });


            connection.query("create database todolist", (err) => {

                if (err) {
                    console.log("Error: Can't create DATABASE 'todolist'");
                    console.log(err);
                    throw err;
                }

                connection.query("use todolist", (err) => {

                    if (err) throw err;

                    console.log("DATABASE 'todolist' created");

                    connection.query("CREATE TABLE users(id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, login VARCHAR(30) NOT NULL, password VARCHAR(256) NOT NULL, email VARCHAR(50) NOT NULL, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)", (err) => {

                        if (err) {
                            console.log("Error: Can't create TABLE 'users'");
                            throw err;
                        }

                        console.log("TABLE 'users' created");
                        connection.query("CREATE TABLE tasks(id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(50) NOT NULL, text TEXT NOT NULL, postDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, userId INT(10) UNSIGNED NOT NULL)", (err) => {

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


module.exports = connection;
