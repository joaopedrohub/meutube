const cloudinary = require("cloudinary").v2

async function renderPublishPage(req, res) {
    const prisma = require("../../prisma/client")

    if (!req.channel) {
        return res.render("unlogged")
    }

    const tags = await prisma.tag.findMany()
    res.render('publish', { channel: req.channel, tags: tags })

}

async function publishVideo(req, res) {
    const prisma = require("../../prisma/client")

    // os metadados do vídeo passaram pelas validações, agora, tem que deixar o usuário enviar o vídeo
    // para o cloudinary, entregando informações como a signature e api_key, caso ele esteja logado

    if (!req.channel) {
        return res.status(401).json({ reason: "Você não tá logado véi... :T" })
    }

    const timestamp = Math.floor(Date.now() / 1000)

    const videoFolder = "videos" // infelizmente pela redundância tem que transformar isso aqui numa variável
    const videoParams = {
        timestamp,
        folder: videoFolder,
        resource_type: "video"
    }

    const videoSignature = cloudinary.utils.api_sign_request(
        { timestamp, folder: videoFolder },
        process.env.CLOUDINARY_API_SECRET
    )

    const thumbnailFolder = "thumbnails"
    const thumbnailParams = {
        timestamp,
        folder: thumbnailFolder,
        resource_type: "image"
    }

    const thumbnailSignature = cloudinary.utils.api_sign_request(
        { timestamp, folder: thumbnailFolder },
        process.env.CLOUDINARY_API_SECRET
    )

    return res.status(200).json({
        uploadData: {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            timestamp,
            video: {
                signature: videoSignature,
                folder: videoFolder,
                resource_type: "video"
            },
            thumbnail: {
                signature: thumbnailSignature,
                folder: thumbnailFolder,
                resource_type: "image"
            }
        }
    })
}

module.exports = {

    renderPublishPage,
    publishVideo

}