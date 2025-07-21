var express = require('express');
var router = express.Router();

const VideoCardInfo = require("../models/VideoCardInfo")

const db = require("../testdb")


/* GET home page. */
router.get('/:channelName', function (req, res, next) {
    const channel = db.channels.find((channel) => channel.name == req.params.channelName)

    if (channel) {

        var videoCardInfos = []
        const channelVideos = channel.videos

        for (var i = 0; i < channelVideos.length; i++) {
            const video = db.videos[channelVideos[i]]

            videoCardInfos.push(new VideoCardInfo(video, channel))

        }

        res.render("channel", { name: channel.name, color: channel.color, videoCardInfos: videoCardInfos})

    } else {
        res.render("videoNotFound")
    }

});

module.exports = router;
