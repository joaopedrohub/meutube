

async function renderPublishPage(req, res) {
    const prisma = require("../../prisma/client")

    const tags = await prisma.tag.findMany()
    res.render('publish', { channel: req.channel, tags: tags })

}

async function publishVideo(req, res) { // não haverá validação. Essa função serve apenas para por o vídeo na database
    const prisma = require("../../prisma/client")

    const videoFile = req.files.video[0]
    const thumbnailFile = req.files.thumbnail[0]

    let newVideo
    
    try {

        newVideo = await prisma.video.create({
            data: {
                title: req.body.title,
                description: req.body.description,
                videoFileName: videoFile.filename,
                thumbnailFileName: thumbnailFile.filename,
                channelId: req.channel.id,

                tags: {
                    connect: req.body.tags.map((name) => ({name}))
                }

            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({reason: "Não foi possível publicar o seu vídeo... A culpa é nossa T-T"})
    }

    return res.sendStatus(201)
}

module.exports = {

    renderPublishPage,
    publishVideo

}