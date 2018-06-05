    const router = require('express').Router();
const task = require('../task');
const user = require('../user');

router.get('/', (req, res) => {

    if(!(req.session.userId == undefined)) {
        //res.render('profile', {userName: req.session.userName});
        if(req.query.title == undefined) {

            if(req.query.page == undefined) {
                req.query.page = 1;
            }

            task.getAllTasks(req, res);

        } else {

            if(req.query.page == undefined)
                req.query.page = 1;

            task.getTasksByTitle(req, res, req.query.title);
        }
    } else {
        res.redirect('/');
    }

});

router.post('/', (req, res) => {

    console.log(req.session.userName);

    if(req.query.page == undefined)
        req.query.page = 1;

    user.signin(req, res);
    console.log(req.body);
});

module.exports = router;