const router = require('express').Router();

router.get('/', (req, res) => {
    console.log(req.session.userId);
    if(!(req.session.userId == undefined)) {
        // logged
        res.redirect('/profile');
    } else {

        res.render('index');
    }
});

router.post('/', (req, res) => {

    req.session.userId = undefined;
    res.render('index');

});

module.exports = router;