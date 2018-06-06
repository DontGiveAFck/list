const router = require('express').Router();
const task = require('../task');

router.get('/add',(req, res) => {

    if(req.session.userId == undefined) {
        res.status(302).redirect('/');
    } else {
        res.render('addtask');
    }
});

router.post('/add', (req, res) => {

    if(req.session.userId == undefined) {
        res.status(400).redirect('/');
    } else {
        task.addTask(req, res);
    }

});

router.post('/remove', (req, res) => {

    if(req.session.userId == undefined) {
        res.status(400).redirect('/');
    } else {
        task.removeTask(req, res);
    }
});

module.exports = router;