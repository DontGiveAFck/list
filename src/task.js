const htmlspecialchars = require('htmlspecialchars');
const connection = require('./database');

module.exports = {

    getAllTasks: function (req, res) {

        let itemsOnPage = 5;
        let pageNum = 0;

        let userId = req.session.userId;

        let from = (Number.parseInt(req.query.page) - 1) * itemsOnPage;
        console.log(from);
        connection.query("SELECT * FROM tasks WHERE userId = ?", [userId], (err, results) => {

            if (err) throw err;

            pageNum = Math.ceil(results.length / itemsOnPage);

            let data;

            let c = connection.query("SELECT * FROM tasks WHERE userId = ? LIMIT ? OFFSET ?",[userId, itemsOnPage, from ], function (err, results, fields) {

                if (err) throw err;

                data = results;

            });

            c.on("end", function () {

                console.log(results.length);
                res.render('profile', {userName: htmlspecialchars(req.session.userName), data: data, pageNum: pageNum});

            });
        });

    },


    getTasksByTitle: function (req, res, title) {

        let tableRows = "";
        let pages = "";
        let itemsOnPage = 5;
        let pageNum = 0;
        let userId = req.session.userId;

        let from = (Number.parseInt(req.query.page) - 1) * itemsOnPage;

        connection.query("SELECT * FROM tasks WHERE userId = ? AND title = ?", [userId, title], (err, results) => {

            if(err) throw err;

            pageNum = Math.ceil(results.length / itemsOnPage);

            let c = connection.query("SELECT * FROM tasks WHERE userId = ? AND title = ? LIMIT ? OFFSET ?",[userId, title, itemsOnPage, from], function (err, results, fields) {


                results.forEach(function (value, index) {

                    tableRows += '<tr> <td>' +  index +  '</td> <td> ' +  htmlspecialchars(results[index].title) + ' </td> <td> ' + htmlspecialchars(results[index].text) + '</td> <td>' + htmlspecialchars(results[index].postDate) + '</td> <tr>';

                });
            });

            for(let i = 1; i <= pageNum; i++) {

                pages += '<li class="page-item"><a class="page-link" href="?page=' + i + '&title=' + title +'">' + i + '</a></li>';
            }

            c.on("end", function () {

               // res.render('profile', {userName: htmlspecialchars(req.session.userName), data: tableRows, pages: pages});
                res.render('profile', {userName: htmlspecialchars(req.session.userName), data: tableRows, pageNum: pageNum, title: title});

            });
        });

    },

    addTask: function (req, res) {

        if(req.session.userId == undefined) {
            res.redirec('/');
        }

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


    }
};

