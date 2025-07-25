var express = require('express');
var router = express.Router();

const VideoCardInfo = require("../models/VideoCardInfo")

const db = require("../testdb");
const { authTokenMiddleware } = require('../models/Authenticator');

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

router.get('/', authTokenMiddleware ,function(req,res,next) {

    res.redirect("http://localhost:3000/channel/" + req.channel.name)
    //pegar o cookie se tiver e levar o cara pro canal dele 
})

module.exports = router;
