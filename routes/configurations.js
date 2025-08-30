var express = require('express');
var router = express.Router();

const getUserChannelMiddleware = require('../middlewares/authentication/getUserChannelMiddleware');

router.get('/', getUserChannelMiddleware, async function (req, res, next) {

    if (req.channel) {
        res.render('configurations');
    } else {
        res.render("unlogged")
    }
  
});




module.exports = router;
