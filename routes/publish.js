var express = require('express')
var router = express.Router()
const multer = require('multer')
const Validator = require('../models/Validator')
const Video = require("../models/Video")
const {authTokenMiddleware, secretKey} = require("../models/Authenticator")
const jwt = require("jsonwebtoken")

const validator = new Validator()

const imageFileTypeWhitelist = [

    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"

]

const videoFileTypeWhitelist = [

    "video/mp4"

]

const allTypesWhiteList = imageFileTypeWhitelist.concat(videoFileTypeWhitelist)

const upload = multer({ 
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            if (imageFileTypeWhitelist.find((mimetype) => mimetype == file.mimetype)) {

                cb(null, "uploads/thumbnails")
            } else if (videoFileTypeWhitelist.find((mimetype) => mimetype == file.mimetype)) {
                cb(null, "uploads/videos")
            } else {
                cb(new Error("Formato de arquivo inválido"))
            }
        },  
    }), 
    fileFilter: (req, file, cb) => {
        if (allTypesWhiteList.find((mimetype) => mimetype == file.mimetype)) {
            cb(null, true)
        } else {
            console.log(file.mimetype + ": Formato de arquivo inválido")
            cb(null, false)
        }
    },
    limits: {fileSize: 50 * 1000000}// x megabytes
})

var db = require("../testdb")
const { json } = require('express')

router.get('/', function (req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).render("unlogged")
    }

    try {
        const channel = jwt.verify(token, secretKey)
        const tags = db.tags
        res.render('publish', {channel: channel, tags: tags})
    } catch (error) {
        res.status(403).send("Token falso safado")
    }

    
})

const multerMiddleware = upload.fields([
    {name: "thumbnail", maxCount: 1},
    {name: "video", maxCount: 1}
])


router.post('/', multerMiddleware, authTokenMiddleware, function (req, res) {
    const body = { ...req.body} // isso é necessário para que o objeto ganhe os métodos de um object (hasOwnProperty, especificamente)
    const requiredInfo = ['title', 'description', 'tags']
    const channel = db.channels[req.channel.id]

    const hasNecessaryInfo = requiredInfo.every((property) => body.hasOwnProperty(property))
    if (hasNecessaryInfo) {
        var title = body.title
        title = validator.trimStringBlankSpace(title)
        const description = body.description
        const tags = body.tags
        
        if (validator.isStringLengthInRange(title, 1, 48) && validator.isStringLengthInRange(description, 0, 1024)) {
            const newVideo = new Video(title, description, channel)
            
            const videoFile = req.files.video[0]
            const videoFile_index = db.videosFile.push("/uploads/videos/" + videoFile.filename) - 1
            
            newVideo.videoFile_id = videoFile_index

            const thumbnail = req.files.thumbnail[0]

            if (thumbnail) {
                const thumbnail_index = db.thumbnails.push("/uploads/thumbnails/" + thumbnail.filename) - 1
                newVideo.thumbnail_id = thumbnail_index
                
            }
            
            // fatorar tags
            const tags = JSON.parse(body.tags)
    
            tags.forEach((tag) => {
                tag = tag.toLowerCase()
                tag = validator.removeStringBlankSpace(tag)
                if (db.tags.find((databaseTag) => databaseTag.name == tag)) {
                    newVideo.tags.push(tag)
                }
            })


            channel.videos.push(newVideo.id)
            const index = db.videos.push(newVideo) - 1
            newVideo.id = index

            console.log(newVideo)

        }
        


    } else {
        res.status(400).json({reason: "Falta informação"})
    }

})

module.exports = router