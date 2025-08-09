const fs = require("fs")
const canAcessPage = require("../../utils/permissioning/canAcessPage")
const path = require("path")
const cloudinary = require("../../config/cloudinary")

const sucessMessages = require("../../utils/messages/sucessMessages")
const problemMessages= require("../../utils/messages/problemMessages")

const cloudinaryCRUD = require("../../utils/cloudinaryCRUD")

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

async function changeVideo(req, res) { // muda o vídeo caso não queira mudar a thumbnail, caso queira, manda a signature

    const prisma = require("../../prisma/client")

    if (!req.channel) {
        return res.status(401).json({reason: problemMessages.unlogged})
    }

    const videoId = parseInt(req.params.id)
    const title = req.body.title
    const description = req.body.description
    const wantsToChangeTheThumbnail = req.body.thumbnail

    if (!wantsToChangeTheThumbnail) {
        let video
        try {
            video = await prisma.video.findFirst({
                where: {
                    id: videoId
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({reason: problemMessages.databaseError})
        }

        if (video) {
            try {
                await prisma.video.update({
                    where: {id: videoId},
                    data: {
                        title: title,
                        description: description
                    }
                })

                return res.status(200).json({reason: sucessMessages.videoChangedWithSucess})
            } catch (error) {
                console.log(error)
                return res.status(500).json({reason: problemMessages.databaseError})
            }

            
        } else {
            return res.status(400).json({reason: "Não achamos o vídeo que você queria mudar :L"})
        }

    } else {

        const timestamp = Math.floor(Date.now() / 1000)

        const folder = "thumbnail"
        const params = {
            timestamp,
            folder,
            resource_type: "image"
        }
        const signature = cloudinary.utils.api_sign_request(
            {timestamp, folder: folder},
            process.env.CLOUDINARY_API_SECRET

        )

        return res.status(202).json({
            uploadData: {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                timestamp,
                thumbnail: {
                    signature: signature,
                    folder: folder,
                    resource_type: "image"
                }
            }
        })


    }



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
        
        const videoFileSecureUrl = video.videoFileName
        const thumbnailFileSecureUrl = video.thumbnailFileName

        try {
            await prisma.video.delete({
                where: { id: videoId }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ reason: "Ocorreu um erro nosso ao tentar deletar o vídeo. Foi mal '~'" })
        }

        res.sendStatus(200)

        setImmediate(async () => {
            let files = [videoFileSecureUrl, thumbnailFileSecureUrl]
            
            await cloudinaryCRUD.deleteBySecureURL(files)
        })

    }



}

module.exports = {
    renderChangePage,
    changeVideo,
    deleteVideo
}