const mysql = require('mysql');
const config = require('./config');
const queries = require('./queries');
const errors = require('./errors');
const loginfo = require('./loginfo');

const DB_NAME = 'todolist';

let connection = mysql.createConnection(config);

connection.connect((err) => {

    if (err) {
        console.log(err);

        if (err.code == errors.ERR_ACCES_DENIED) {
            console.log(loginfo.ACCESS_DENIED);

            throw err;
        }

        if (err.code == errors.ERR_BAD_DB) {

            console.error(loginfo.NO_CONNECTION);

            connection = mysql.createConnection({
                host     : config.host,
                user     : config.user,
                password : config.password
            });


            connection.query(queries.createDatabase, (err) => {

                if (err) {
                    console.log(loginfo.CANNOT_CREATE_DB);
                    console.log(err);
                    throw err;
                }

                connection.query(queries.useDatabase, (err) => {

                    if (err) throw err;

                    console.log(loginfo.DB_CREATED);

                    connection.query(queries.createTableUsers, (err) => {

                        if (err) {
                            console.log(loginfo.CANNOT_CREATE_TB_USERS);
                            throw err;
                        }

                        console.log(loginfo.TB_USERS_CREATED);
                        connection.query(queries.createTableTasks, (err) => {

                            if (err) {
                                console.log(loginfo.CANNOT_CREATE_TB_TASKS);
                                throw err;
                            }

                            console.log(loginfo.TB_TASKS_CREATED);
                            console.log(loginfo.DB_AND_TB_CREATED);

                            connection = mysql.createConnection({
                                host     : config.host,
                                user     : config.user,
                                password : config.password,
                                database : DB_NAME
                            });
                        });
                    });
                });
            });
        }
    } else {
        console.log(loginfo.CONNECTED_TO_DB + connection.threadId);
    }
});


module.exports = connection;
