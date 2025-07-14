var express = require('express')
var router = express.Router()
const multer = require('multer')
const Validator = require('../models/Validator')
const Video = require("../models/Video")

const validator = new Validator()

const fileTypeWhitelist = [

    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"

]

const upload = multer({ 
    dest: "uploads/", 
    fileFilter: (req, file, cb) => {
        if (fileTypeWhitelist.find((mimetype) => mimetype == file.mimetype)) {
            cb(null, true)
        } else {
            console.log(file.mimetype + ": Formato de arquivo inválido. Ou")
            cb(null, false)
        }
    },
    limits: {fileSize: 5 * 1000000}
})

var db = require("../testdb")

router.get('/', function (req, res, next) {
    res.render('publish')
})

router.post('/', upload.single('thumbnail'), function (req, res) {
    const body = { ...req.body} // isso é necessário para que o objeto ganhe os métodos de um object (hasOwnProperty, especificamente)
    const requiredInfo = ['title', 'description', 'tags']
    
    const hasNecessaryInfo = requiredInfo.every((property) => body.hasOwnProperty(property))

    if (hasNecessaryInfo) {
        var title = body.title
        title = validator.trimStringBlankSpace(title)
        const description = body.description
        const tags = body.tags
        
        if (validator.isStringLengthInRange(title, 1, 48) && validator.isStringLengthInRange(description, 0, 1024)) {
            const newVideo = new Video(title, description)
            const index = db.videos.push(newVideo)
            newVideo.id = index

            const thumbnail = req.file

            if (thumbnail) {
                const thumbnail_index = db.thumbnails.push("/uploads/" + thumbnail.filename)
                newVideo.thumbnail_id = thumbnail_index - 1
                
            }
        }
        


    } else {
        console.log("não pode")
        res.status(400).send("Malformed publish request.")
    }


})

module.exports = router