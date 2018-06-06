
module.exports = {
    selectFromUsersBylogin: 'SELECT * FROM users WHERE login = ?',
    insertIntoUsersLoginPasswordEmail: 'INSERT INTO users (login, password, email) VALUES(?, ?, ?)',
    selectFromTasksByUserId: "SELECT * FROM tasks WHERE userId = ?",
    selectFromTasksByUserIdLimitOffset: "SELECT * FROM tasks WHERE userId = ? LIMIT ? OFFSET ?",
    selectFromTasksByUserIdTitle: "SELECT * FROM tasks WHERE userId = ? AND title = ?",
    selectFromTasksByUserIdTitleLimitOffset: "SELECT * FROM tasks WHERE userId = ? AND title = ? LIMIT ? OFFSET ?",
    createDatabase: "create database todolist",
    useDatabase: "use todolist",
    createTableUsers: "CREATE TABLE users(id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, login VARCHAR(30) NOT NULL, password VARCHAR(256) NOT NULL, email VARCHAR(50) NOT NULL, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    createTableTasks: "CREATE TABLE tasks(id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(50) NOT NULL, text TEXT NOT NULL, postDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, userId INT(10) UNSIGNED NOT NULL)",
};