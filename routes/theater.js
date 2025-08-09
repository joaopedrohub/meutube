let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const isLoggedMiddleware = require("../middlewares/authentication/isLoggedMiddleware")

router.get('/:videoId', isLoggedMiddleware, async function (req, res, next) {
  const prisma = require('../prisma/client')

  const videoId = parseInt(req.params.videoId)

  const video = await prisma.video.findUnique({ where: { id: videoId }, include: { tags: true } })

  if (video) {
    const channelId = video.channelId
    const channel = await prisma.channel.findUnique({ where: { id: channelId } })
    const videoURL = video.videoFileName

    if (channel) {
      
      if (req.logged) {

        prisma.video.update({
          where: {id: videoId},
          data: {views: {increment: 1}}
        }).catch((reason) => console.error("Erro ao incrementar visualização: " + reason))

      }

      res.render("theater", { video: video, channel: channel, videoURL: videoURL, tags: video.tags });

    } else {
      res.render("videoNotFound")
    }
  } else {
    res.render('videoNotFound')
  }

});

router.get('/', function (req, res, next) {
  res.render('videoNotFound')
})

module.exports = router;
