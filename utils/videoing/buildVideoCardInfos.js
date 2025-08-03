const VideoCardInfo = require("../../models/VideoCardInfo")
const { channel } = require("../../prisma/client")

async function buildVideoCardInfos(videos) {
    let videoCardInfos = []
    let channelsCache = new Map()

    const prisma = require("../../prisma/client")

    for  (const video of videos) {
        let channel
        const channelInCache = channelsCache.get(video.channelId)

        if (channelInCache) {
            channel = channelInCache
        } else {
            channel = await prisma.channel.findUnique({ where: { id: video.channelId } })
            channelsCache.set(video.channelId, channel)
        }
        videoCardInfos.push(new VideoCardInfo(video, channel))
    }

    return videoCardInfos
}

module.exports = buildVideoCardInfos