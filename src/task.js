const htmlspecialchars = require('htmlspecialchars');
const connection = require('./database');
const queries = require('./queries');
const msg = require('./msgtouser');


module.exports = {

    getAllTasks: function (req, res) {

        let itemsOnPage = 5;
        let pageNum = 0;

        let userId = req.session.userId;

        let from = (Number.parseInt(req.query.page) - 1) * itemsOnPage;
        console.log(from);
        connection.query(queries.selectFromTasksByUserId, [userId], (err, results) => {

            if (err) throw err;

            pageNum = Math.ceil(results.length / itemsOnPage);

            let data;

            let c = connection.query(queries.selectFromTasksByUserIdLimitOffset,[userId, itemsOnPage, from ], function (err, results, fields) {

                if (err) throw err;

                data = results;

            });

            c.on("end", function () {

                let obj = {
                    pageNum: pageNum
                };

                console.log(results.length);

                res.render('profile', {userName: htmlspecialchars(req.session.userName), data: data, obj: obj});

            });
        });

    },


    getTasksByTitle: function (req, res, title) {

        let itemsOnPage = 5;
        let pageNum = 0;
        let userId = req.session.userId;

        let from = (Number.parseInt(req.query.page) - 1) * itemsOnPage;

        connection.query(queries.selectFromTasksByUserIdTitle, [userId, title], (err, results) => {

            if(err) throw err;

            let data;

            pageNum = Math.ceil(results.length / itemsOnPage);

            let c = connection.query(queries.selectFromTasksByUserIdTitleLimitOffset,[userId, title, itemsOnPage, from], function (err, results, fields) {

                data = results;

                console.log(data);
            });


            c.on("end", function () {

                let obj = {
                    title: title,
                    pageNum: pageNum
                };

                res.render('profile', {userName: htmlspecialchars(req.session.userName), data: data, obj: obj});

            });
        });

    },

    addTask: function (req, res) {

        if(req.session.userId == undefined) {
            res.redirect('/');
        }
    
        let con = connection.query(queries.insertIntoTasks, [req.body.title, req.body.text, req.session.userId], function (err) {

            if(err) throw err;
            else {
                res.send(msg.TASK_ADDED + htmlspecialchars(req.body.title));
            }
        });
    },

    removeTask: function (req, res) {

        let title = req.body.title;
        let userId = req.session.userId;

        let con = connection.query(queries.deleteFromTasks, [title, userId], (err, results) => {

            if (err) throw err;

            if(results.length == 0) {
                res.send(msg.NO_TASK + htmlspecialchars(title));
            } else {
                res.send(msg.TASK_REMOVED);
            }
        });


    }
};

