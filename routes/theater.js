var express = require('express');
var router = express.Router();

router.get('/:videoId', function(req, res, next) {
  res.render("theater", {videoId: req.params.videoId});
});

router.get('/', function(req, res, next) {
  console.log("teste")
  res.render('videoNotFound')
})

module.exports = router;
