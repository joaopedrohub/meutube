var express = require('express')
var router = express.Router()
const multer = require('multer')
const Validator = require('../models/Validator')
const Video = require("../models/Video")
const {authTokenMiddleware, secretKey} = require("../models/Authenticator")
const jwt = require("jsonwebtoken")
const fs = require("fs")

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

router.get('/publish', function (req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).render("unlogged")
    }

    try {
        const channel = jwt.verify(token, secretKey)
        res.render('publish', {channel: channel})
    } catch (error) {
        res.status(403).send("Token falso safado")
    }

    
})

const publishMulterMiddleware = upload.fields([
    {name: "thumbnail", maxCount: 1},
    {name: "video", maxCount: 1}
])

const changeMulterMiddleware = upload.single("thumbnail")


router.post('/publish', publishMulterMiddleware, authTokenMiddleware, function (req, res) {
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

            channel.videos.push(newVideo.id)
            const index = db.videos.push(newVideo) - 1
            newVideo.id = index

        }
        


    } else {
        res.status(400).json({reason: "Falta informação"})
    }

})

router.get('/change/:id', authTokenMiddleware, function(req, res, next) {
    const video = db.videos[req.params.id]
    if (video) {
        const channel = db.channels[video.by]
        if (channel && video.by == req.channel.id) {
            console.log("permitido")
            const thumbnail = db.thumbnails[video.thumbnail_id]
            res.render("change", {video: video, channel: channel, thumbnailPath: thumbnail})
        } else {
            console.log("dfsaf")
            res.render("videoNotFound")
        } 
    } else {
        console.log("sad")
        res.render("videoNotFound")
    }
})

router.put('/change', changeMulterMiddleware, authTokenMiddleware, function(req, res, next) {
    const body = {...req.body}
    
    const requiredInfo = ['videoId', 'title', 'description']
    const hasNecessaryInfo = requiredInfo.every((property) => body.hasOwnProperty(property))

    if (hasNecessaryInfo) {
        const video = db.videos[body.videoId]
        if (video) {
            //vídeo achado, verificar se as credenciais batem
            if (video.by == req.channel.id) {
                // válido
                video.title = body.title
                video.description = body.description
                if (req.file) {
                    const oldThumbnail_Index = video.thumbnail_id
                    const oldThumbnailPath = db.thumbnails[oldThumbnail_Index]
                    const newThumbnail_index = db.thumbnails.push("/uploads/thumbnails/" + req.filename) - 1
                    video.thumbnail_id = newThumbnail_index

                    fs.unlink(oldThumbnailPath, (error) => {
                        if (error) {
                            console.log("Erro ao apagar arquivo: " + error.stack)
                        }
                    })
                    db.thumbnails[oldThumbnail_Index] = null
                }
                res.sendStatus(200)
            }

        } else {
            
        }

    }
})

router.delete('/change/:id', authTokenMiddleware, function(req,res,next) {
    
    if (req.params.id) {
        const video = db.thumbnails.video[body.videoId]
        if (video && video.by == req.channel.id) { 
            const videoFilePath = db.videosFile[video.videoFile_id]
            const thumbnailPath = db.thumbnails[video.thumbnail_id]

            db.videos[video.id] = null

            fs.unlink(videoFilePath, (error) =>{
                console.log("Erro ao apagar arquivo: " + error.stack)
            })

            fs.unlink(thumbnailPath, (error) => {
                console.log("Erro ao apagar arquivo: " + error.stack)
            })
        ) // deleta isso e continua fazendo
            res.sendStatus(200).redirect("localhost:3000//")
        }
    }
    
})

module.exports = router