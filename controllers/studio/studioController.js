const buildVideoCardInfos = require("../../utils/videoing/buildVideoCardInfos")

async function renderStudioPage(req, res) {

    const prisma = require("../../prisma/client")

    if (req.channel) {
        
        let videos 

        try {
            videos = await prisma.video.findMany({
                where: {
                    channelId: req.channel.id
                }
            })
        } catch (error) {
            console.log(error)
            videos = []
        }

        const videoCardInfos = await buildVideoCardInfos(videos)
        console.log(videoCardInfos)
        return res.render("studio", {videoCardInfos: videoCardInfos})

    } else {
        return res.render("unlogged")
    }
}

module.exports = {

    renderStudioPage

}