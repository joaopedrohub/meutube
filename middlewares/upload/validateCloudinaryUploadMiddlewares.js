const cloudinary = require("../../config/cloudinary")

const maxThumbnailSize = 5 * 1024 * 1024 // 5mb para thumbnails
const maxVideoSize = 100 * 1024 * 1024 //100 mb para vídeos

async function validateCloudinaryPublishMiddleware(req, res, next) {
    const { videoPublicId, thumbnailPublicId } = req.body

    if (!videoPublicId || !thumbnailPublicId) {
        return res.status(400).json({ reason: "Falta id de algum dos arquivos: Vídeo ou thumbnail. •k" })
    }

    try {
        const [videoInfo, thumbnailInfo] = await Promise.all([
            cloudinary.api.resource(videoPublicId, { resource_type: "video" }),
            cloudinary.api.resource(thumbnailPublicId, { resource_type: "image" }),
        ])

        if (!["mp4", "mov", "mkv", "avi"].includes(videoInfo.format)) {
            res.status(400).json({ reason: "Vídeo precisa ter esses formatos: MP4 ou MOV ou MKV ou AVI." })
        }

        if (videoInfo.bytes > maxVideoSize) {
            res.status(400).json({ reason: "Vídeo excede tamanho máximo de 100MB" })
        }

        if (!["jpg", "jpeg", "webp", "png"].includes(thumbnailInfo.format)) {
            res.status(400).json({ reason: "Thumbnail precisa ter esse formatos: JPG ou JPEG ou WEBP ou PNG." })
        }

        if (thumbnailInfo.bytes > maxThumbnailSize) {
            res.status(400).json({ reason: "Thumbnail excede tamanho máximo de 5MB." })
        }

        req.cloudinary = {
            video: videoInfo,
            thumbnail: thumbnailInfo
        }

        return next()
    } catch (error) {
        console.error("Erro ao validar arquivos no cloudinary:" + error.message)
        res.status(500).json({ reason: "Deu algo errado ao verificar arquivos no cloudinary" })
    }
}

async function validateCloudinaryChangeMiddleware(req, res, next) {
    const { thumbnailPublicId } = req.body

    if (!thumbnailPublicId) {
        return res.status(400).json({ reason: "Falta id de algum do arquivo da thumbnail. •k" })
    }

    try {
        const thumbnailInfo = await cloudinary.api.resource(thumbnailPublicId, { resource_type: "image" })

        if (!["jpg", "jpeg", "webp", "png"].includes(thumbnailInfo.format)) {
            res.status(400).json({ reason: "Thumbnail precisa ter esse formatos: JPG ou JPEG ou WEBP ou PNG." })
        }

        if (thumbnailInfo.bytes > maxThumbnailSize) {
            res.status(400).json({ reason: "Thumbnail excede tamanho máximo de 5MB." })
        }

        req.cloudinary = {
            thumbnail: thumbnailInfo
        }

        return next()
    } catch (error) {
        console.error("Erro ao validar arquivos no cloudinary:" + error.message)
        res.status(500).json({ reason: "Deu algo errado ao verificar arquivos no cloudinary" })
    }
}

module.exports = {
    validateCloudinaryPublishMiddleware,
    validateCloudinaryChangeMiddleware
}