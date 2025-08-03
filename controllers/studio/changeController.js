const fs = require("fs")
const canAcessPage = require("../../utils/permissioning/canAcessPage")
const path = require("path")

async function renderChangePage(req, res) {

    const prisma = require("../../prisma/client")

    if (!req.channel) {
        res.render("unlogged")
    }

    const videoId = req.params.videoId
    let video

    try {
        video = await prisma.video.findFirst({
            where: { id: videoId },
            include: { channel: true }
        })
    } catch (error) {
        return res.status(500).render("videoNotFound")
    }

    if (!video) {
        return res.status(404).render("videoNotFound")
    }

    if (!canAcessPage(req.channel, video.channel)) {
        return res.status(401).render("unauthorized")
    }

    res.render("change", { video: video, channel: req.channel, thumbnailPath: video.thumbnailPath })

}

async function changeVideo(req, res) { // essa função vai só mudar o vídeo, sem fazer validação de nada

    const prisma = require("../../prisma/client")

    if (!req.channel) {
        return
    }

    const videoId = parseInt(req.params.id)
    console.log(req.body)
    const title = req.body.title
    const description = req.body.description
    const newThumbnailPath = req.file ? "/uploads/thumbnail/" + req.file.filename : undefined

    let video
    try {
        video = await prisma.video.findFirst({
            where: { id: videoId },
            include: { channel: true }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ reason: "Ocorreu um erro nosso ao tentar editar o vídeo. Desculpe :x" })
    }

    const oldThumbnailPath = path.resolve(__dirname, "../uploads/thumbnails" + video.thumbnailFileName)

    if (req.channel.admin || req.channel.id === video.channel.id) {

        try {
            await prisma.video.update({
                where: {
                    id: videoId
                },
                data: {
                    title: title,
                    description: description,
                    thumbnailPath: newThumbnailPath
                }
            })

        } catch (error) {
            return res.status(500).json({ reason: "Ocorreu um erro nosso ao tentar editar o vídeo. Desculpe :x" })
        }

    }

    if (newThumbnailPath) {
        fs.unlink(oldThumbnailPath, (error) => {
            console.log(error)
        })
    }
    return res.sendStatus(200)

}

async function deleteVideo(req, res) {

    const prisma = require("../../prisma/client")

    if (!req.channel) {
        return
    }

    const videoId = parseInt(req.params.id)

    let video
    try {
        video = await prisma.video.findFirst({
            where: { id: videoId },
            include: { channel: true }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ reason: "Ocorreu um erro nosso ao tentar deletar o vídeo. Foi mal '~'" })
    }

    if (!video) {
        return res.status(404).json({ reason: "Não achamos o vídeo que você quer deletar ;-;" })
    }

    if (req.channel.admin || req.channel.id === video.channel.id) {
        const thumbnailFilePath = path.resolve(__dirname, "../uploads/thumbnails", video.thumbnailFileName)
        const videoFilePath = path.resolve(__dirname, "../uploads/videos", video.videoFileName)

        fs.unlink(thumbnailFilePath, function(error) {
            console.log("Erro ao apagar thumbnail: " + error)
        })
        fs.unlink(videoFilePath, function(error) {
            console.log("Erro ao apagar arquivo de vídeo: " + error)
        })


        try {
            await prisma.video.delete({
                where: { id: videoId }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ reason: "Ocorreu um erro nosso ao tentar deletar o vídeo. Foi mal '~'" })
        }

        res.sendStatus(200)



    }



}

module.exports = {
    renderChangePage,
    changeVideo,
    deleteVideo
}