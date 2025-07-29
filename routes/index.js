var express = require('express');
var router = express.Router();

const VideoCardInfo = require("../models/VideoCardInfo")


/* GET home page. */
router.get('/', async function (req, res, next) {

  const prisma = require('../prisma/client')

  const videos = await prisma.video.findMany({ take: 10 })

  var videoCardInfos = []

  let channelsCache = new Map()

  for (var i = 0; i < videos.length; i++) {
    const video = videos[i]
    const channelId = video.channelId

    let channel

    if (channelsCache.get(channelId)) {
      channel = channelsCache.get(channelId)
    } else {
      channel = await prisma.channel.findUnique({ where: { id: channelId } })
      channelsCache.set(channelId)
    }

    videoCardInfos.push(new VideoCardInfo(video, channel))

  }

  res.render('index', { videoCardInfos: videoCardInfos });
});

router.get('/tag/:tag', async function (req, res, next) {

  const prisma = require('../prisma/client')

  const tagName = req.params.tag

  let tag
  try {
    tag = prisma.tag.findFirst({ where: { name: tagName } })
  } catch (error) {
    console.log(error)
    res.render("index", { videoCardInfos: [] })
  }

  if (tag) {
    let videos
    try {
      videos = await prisma.video.findMany({
        where: {
          tags: {
            some: {
              name: tag.name
            }
          }
        }
      })
    } catch (error) {
      console.log(error)
      res.render("index", { videoCardInfos: [] })
    }

    var videoCardInfos = []

    let channelsCache = new Map()

    for (var i = 0; i < videos.length; i++) {
      const video = videos[i]
      const channelId = video.channelId

      let channel

      if (channelsCache.get(channelId)) {
        channel = channelsCache.get(channelId)
      } else {
        channel = await prisma.channel.findUnique({ where: { id: channelId } })
        channelsCache.set(channelId)
      }

      videoCardInfos.push(new VideoCardInfo(video, channel))

    }


  }

  res.render('index', { videoCardInfos: videoCardInfos });

})


module.exports = router;
