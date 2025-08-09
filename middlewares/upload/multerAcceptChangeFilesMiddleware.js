const { error } = require("console")
const multer = require("multer")
const path = require("path")

const max_thumbnail_size = 5 * 1024 * 1024 //5 mb

const fileTypeFilter = (req, file, cb) => {
    const imageTypeWhiteList = [".jpg", ".jpeg", ".png", ".webp"]

    const fileExtension = path.extname(file.originalname).toLowerCase()

    if (file.fieldname === "thumbnail" && imageTypeWhiteList.includes(fileExtension)) {
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
        } 
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname)
        cb(null, file.originalname.replace(fileExtension, "") + "-" + `${Date.now()}${fileExtension}`)
    }
})

const changeVideoMiddleware = multer({
    storage: storage,
    fileFilter: fileTypeFilter,
    limits: {
        fileSize: max_thumbnail_size
    }
}).single("thumbnail")

module.exports = changeVideoMiddleware

