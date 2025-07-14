var express = require('express');
var router = express.Router();

var db = require("../testdb")

router.get('/:videoId', function(req, res, next) {

  const videoId = req.params.videoId
  const video = db.videos.find((video) => video.id == videoId)

  if (video) {
    const channel = db.channels.find((channel) => video.by == channel.id)
    video.views += 1
    if (channel) {
      res.render("theater", {video: video, channel: channel});
    } else {
      next()
    }
  } else {
    next()
  }
  
});

router.get('/', function(req, res, next) {
  res.render('videoNotFound')
})

module.exports = router;
