const mysql = require('mysql');
const config = require('./config');
const queries = require('./queries');

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


            connection.query(queries.createDatabase, (err) => {

                if (err) {
                    console.log("Error: Can't create DATABASE 'todolist'");
                    console.log(err);
                    throw err;
                }

                connection.query(queries.useDatabase, (err) => {

                    if (err) throw err;

                    console.log("DATABASE 'todolist' created");

                    connection.query(queries.createTableUsers, (err) => {

                        if (err) {
                            console.log("Error: Can't create TABLE 'users'");
                            throw err;
                        }

                        console.log("TABLE 'users' created");
                        connection.query(queries.createTableTasks, (err) => {

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
