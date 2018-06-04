const router = require('express').Router();
const user = require('../user');

router.get('/', (req, res) => {

    if(!(req.session.userId == undefined)) {
        // logged
        res.redirect('/profile')
    } else {
        res.render('signup', {answer: ""});
    }
});

router.post('/', (req, res) => {

    if(!(req.session.userId == undefined)) {
        // logged
        res.redirect('/profile')
    } else {
        user.signup(req, res);
    }
});

module.exports = router;