var express = require('express');
var router = express.Router();

const VideoCardInfo = require("../models/VideoCardInfo")

const db = require("../testdb")


/* GET home page. */
router.get('/', function(req, res, next) {

  const videos = db.videos
  const channels = db.channels

  var videoCardInfos = []

  for (var i = 0; i < videos.length; i++) {
    const video = videos[i]
    const channel = channels[video.by]

    videoCardInfos.push(new VideoCardInfo(video, channel))

  }


  res.render('index', {videoCardInfos: videoCardInfos});




});

module.exports = router;
