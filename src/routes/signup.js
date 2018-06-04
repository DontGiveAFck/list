const router = require('express').Router();

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
        res.render('signup', {answer: ""});
    }
});

module.exports = router;