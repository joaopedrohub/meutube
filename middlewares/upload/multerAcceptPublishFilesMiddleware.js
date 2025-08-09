const { error } = require("console")
const multer = require("multer")
const path = require("path")

const max_thumbnail_size = 5 * 1024 * 1024 //5 mb
const max_video_size = 100 * 1024 * 1024 // 100mb

const fileTypeFilter = (req, file, cb) => {
    const imageTypeWhiteList = [".jpg", ".jpeg", ".png", ".webp"]
    const videoTyleWhiteList = [".mp4", ".mov", ".avi", ".mkv"]

    const fileExtension = path.extname(file.originalname).toLowerCase()

    if (file.fieldname === "thumbnail" && imageTypeWhiteList.includes(fileExtension)) {
        cb(null, true)
    } else if (file.fieldname == "video" && videoTyleWhiteList.includes(fileExtension)) {
        cb(null, true)
    } else {

        const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE')
        error.message = "Tipo de arquivo não suportado: " + fileExtension + " :/"

        cb(error)
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "thumbnail") {
            cb(null, 'uploads/thumbnails/')
        } else if (file.fieldname == "video") {
            cb(null, 'uploads/videos/')
        }
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname)
        cb(null, file.originalname.replace(fileExtension, "") + "-" + `${Date.now()}${fileExtension}`)
    }
})

const multerAcceptPublishFilesMiddleware = multer({
    storage: storage,
    fileFilter: fileTypeFilter,
    limits: {
        fileSize: max_video_size // esse é o valor máximo. O tamanho de cada arquivo vai ser checado em outra função
    }
}).fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
])

const validateFileSizesMiddleware = (req, res, next) => {
    const thumbnail = req.files?.thumbnail?.[0]
    const video = req.files?.video?.[0]

    if (thumbnail && thumbnail.size > max_thumbnail_size) {
        return res.status(400).json({ reason: "Thumbnail excede o tamanho máximo de 5MB" })
    }

    if (video && video.size > max_video_size) {
        return res.status(400).json({ reason: "Vídeo excede o tamanho máximo de 100MB" })
    }

    next()
}

module.exports = {
    multerAcceptPublishFilesMiddleware,
    validateFileSizesMiddleware
    
}