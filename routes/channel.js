var express = require('express');
var router = express.Router();

const VideoCardInfo = require("../models/VideoCardInfo")

const db = require("../testdb");
const { authTokenMiddleware } = require('../models/Authenticator');

router.get('/:channelName', async function (req, res, next) {

    const prisma = require("../prisma/client")

    let channel

    try {
        channel = await prisma.channel.findFirst({ where: { name: req.params.channelName } })
    } catch (error) {
        console.log(error)
        res.status(404).render('videoNotFound')
    }

    if (channel) {
        let videos
        try {
            videos = await prisma.video.findMany({
                where: { channelId: channel.id },
            })
        } catch (error) {
            console.log(error)
            videos = false
        }

        if (videos) {
            let videoCardInfos = []
            for (let i = 0; i < videos.length; i++) {
                const video = videos[i]

                videoCardInfos.push(new VideoCardInfo(video, channel))

            }

            res.render("channel", { name: channel.name, color: channel.color, videoCardInfos: videoCardInfos })
        } else {
            res.render("channel", { name: channel.name, color: channel.color, videoCardInfos: false })
        }

    } else {
        res.render("videoNotFound")
    }

});

router.get('/', authTokenMiddleware, function (req, res, next) {

    res.redirect("http://localhost:3000/channel/" + req.channel.name)
    //pegar o cookie se tiver e levar o cara pro canal dele 
})

module.exports = router;
