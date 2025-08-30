var express = require('express');
var router = express.Router();

const VideoCardInfo = require("../models/VideoCardInfo")


const getUserChannelMiddleware = require('../middlewares/authentication/getUserChannelMiddleware');

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

router.delete('/', getUserChannelMiddleware, async function (req, res, next) {

    const prisma = require("../prisma/client")

    if (!req.channel) {
        return
    }

    let channelToDelete
    try {
        channelToDelete = await prisma.channel.findFirst({ where: { name: req.params.channelName } })
    } catch (error) {
        console.log(error)
        res.status(404).render('videoNotFound')
    }

    if (channelToDelete) {
        if (req.channel.admin || req.channel.id == channelToDelete.id) {
            try {
                //primeiro deletar todos os vídeos do canal 
                await prisma.video.deleteMany({
                    where: { channel: channelToDelete }
                })
                await prisma.channel.delete({
                    where: { id: channelToDelete.id }
                })

            } catch (error) {
                console.log(error)
                res.sendStatus(500)
            }

            res.cookie("token", '', {
                expires: new Date(0),
                secure: false,
                httpOnly: true,
                path: '/'
            })

            res.sendStatus(204)
        }
    } else {
        res.sendStatus(404)
    }
})

router.get('/', getUserChannelMiddleware, function (req, res, next) {

    if (req.channel) {
        res.redirect("/channel/" + req.channel.name)
    } else {
        res.render("unlogged")
    }
    //pegar o cookie se tiver e levar o cara pro canal dele 
})

module.exports = router;
