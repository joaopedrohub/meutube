var express = require('express')
var router = express.Router()
const multer = require('multer')
const Validator = require('../models/Validator')
const Video = require("../models/Video")
const { authTokenMiddleware, isLoggedMiddleware } = require("../models/Authenticator")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const prisma = require('../prisma/client')

const validator = new Validator()

const imageFileTypeWhitelist = [
    
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
        destination: function (req, file, cb) {
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
    limits: { fileSize: 50 * 1000000 }// x megabytes
})

router.get('/publish', authTokenMiddleware, async function (req, res, next) {

    const tags = await prisma.tag.findMany()
    res.render('publish', { channel: req.channel, tags: tags })

})

const publishMulterMiddleware = upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 }
])

const changeMulterMiddleware = upload.single("thumbnail")

router.post('/publish', authTokenMiddleware, async function (req, res) {

    publishMulterMiddleware(req,res,async function(error) {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({reason: "Um dos arquivos que você enviou excede o limite de 50MB :|"})
        } else if (error) {
            return res.status(400).json({reason: "Não consegui processar um dos arquivos que você enviou... gulp... :c"})
        }

        const body = { ...req.body } // isso é necessário para que o objeto ganhe os métodos de um object (hasOwnProperty, especificamente)
    const requiredInfo = ['title', 'description', 'tags']
    const channel = req.channel

    if (!req.files.video || !req.files.thumbnail) {
        return res.status(400).json({ reason: "Você esqueceu de enviar um arquivo ou enviou um arquivo com formato inválido. Você pode usar jpg ou webp para thumbnails e mp4 para vídeos" })
    }

    const hasNecessaryInfo = requiredInfo.every((property) => body.hasOwnProperty(property))
    if (hasNecessaryInfo && req.files.video[0] && req.files.thumbnail[0]) {

        const prisma = require("../prisma/client")

        let title = body.title
        title = validator.trimStringBlankSpace(title)
        const description = body.description

        if (validator.isStringLengthInRange(title, 1, 48) && validator.isStringLengthInRange(description, 0, 1024)) {

            const videoFile = req.files.video[0]
            const videoFilePath = "/uploads/videos/" + videoFile.filename

            const thumbnailFile = req.files.thumbnail[0]
            let thumbnailFilePath
            if (thumbnailFile) {
                thumbnailFilePath = "/uploads/thumbnails/" + thumbnailFile.filename
            } else {
                thumbnailFilePath = "/defaultThumbnail"
            }


            const tags = JSON.parse(body.tags)
            let newVideo
            console.log(tags.map((name => ({name}))))
            try {
                newVideo = await prisma.video.create({
                    data: {
                        title: title,
                        description: description,
                        videoPath: videoFilePath,
                        thumbnailPath: thumbnailFilePath,
                        channelId: channel.id,

                        tags: {
                            connect: tags.map((name) => ({ name }))
                        }


                    }

                })
            } catch (error) {
                console.error(error.message)
                res.status(500).json({ reason: "Desculpa. Não consegui criar o vídeo. Talvez você tenha enviado uma tag que não existe? :(" })
            }
            return res.sendStatus(201)

        } else {
            res.status(400).json({ reason: "Título ou descrição não estão dentro do limite de 1 a 48 caracteres e 0 a 1024 caracteres respectivamente." })
        }

    } else {
        res.status(400).json({ reason: "Faltou você enviar alguma coisa... :(" })
    }
    })

})

router.get('/change/:id', authTokenMiddleware, async function (req, res, next) {

    const videoId = parseInt(req.params.id)
    const channel = req.channel

    const prisma = require("../prisma/client")

    let video
    try {
        video = await prisma.video.findFirst({ where: { id: videoId } })
    } catch (error) {
        console.error(error)
    }

    if (video) {
        if (video.channelId == channel.id) {
            const thumbnailPath = video.thumbnailPath
            res.render("change", { video: video, channel: channel, thumbnailPath: thumbnailPath })
        } else {
            res.render("unlogged") // na verdade é não autorizado
        }
    } else {
        res.render("videoNotFound")
    }
})

router.put('/change/:id', changeMulterMiddleware, authTokenMiddleware, async function (req, res, next) {
    const body = { ...req.body }

    const requiredInfo = ['title', 'description']
    const hasNecessaryInfo = requiredInfo.every((property) => body.hasOwnProperty(property))

    if (hasNecessaryInfo) {

        const prisma = require("../prisma/client")

        const title = validator.trimStringBlankSpace(body.title)
        const videoId = parseInt(req.params.id)

        let [sucess, reason] = validator.isValidVideoTitle(title)
        if (!sucess) {
            res.status(400).send({ reason: reason })
        }

        [sucess, reason] = validator.isValidVideoDescription(body.description)
        if (!sucess) {
            res.status(400).send({ reason: reason })
        }

        let video

        try {
            video = await prisma.video.findFirst({ where: { id: videoId } })
        } catch (error) {
            console.log(error)
            res.render("videoNotFound")
        }

        if (video) {
            //vídeo achado, verificar se as credenciais batem
            if (video.channelId == req.channel.id) {
                // válido
                if (req.file) {
                    const oldThumbnailPath = video.thumbnailPath

                    fs.unlink(oldThumbnailPath, (error) => {
                        if (error) {
                            console.log("Erro ao apagar arquivo: " + error.stack)
                        }
                    })

                    const newThumbnailPath = "/uploads/thumbnails/" + req.file.filename

                    try {
                        await prisma.video.update({
                            where: {
                                id: videoId
                            },
                            data: {
                                title: title,
                                description: body.description,
                                thumbnailPath: newThumbnailPath
                            }
                        })
                    } catch (error) {
                        console.log(error)
                        res.status(500).send({ reason: "Ocorreu um erro ao editar o seu vídeo :(" })

                    }

                } else {

                    try {
                        await prisma.video.update({
                            where: {
                                id: videoId
                            },
                            data: {
                                title: title,
                                description: body.description
                            }
                        })
                    } catch (error) {
                        console.log(error)
                        res.status(500).send({ reason: "Ocorreu um erro ao editar o seu vídeo :(" })
                    }
                }
                res.sendStatus(200)
            }

        } else {
            res.sendStatus(404)
        }

    }
})

router.delete('/change/:id', authTokenMiddleware, async function (req, res, next) {


    const videoId = parseInt(req.params.id)
    const prisma = require("../prisma/client")

    let video

    try {
        video = await prisma.video.findFirst({
            where: {
                id: videoId
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ reason: "Ocorreu um erro ao deletar o seu vídeo :(" })

    }

    if (video) {

        //achamos o vídeo, mas será que quem quer deletar ele é o dono do vídeo?

        if (video.channelId == req.channel.id) {
            const thumbnailPath = video.thumbnailPath
            const videoPath = video.videoPath

            fs.unlink(videoPath, (error) => {
                console.log("Erro ao apagar arquivo: " + error.stack)
            })

            fs.unlink(thumbnailPath, (error) => {
                console.log("Erro ao apagar arquivo: " + error.stack)
            })
            try {
                await prisma.video.delete({ where: { id: video.id } })
            } catch (error) {
                console.log(error)
                res.status(500).send({reson: "Ocorreu um erro ao deletar o seu vídeo :("})
            }
            res.sendStatus(200)
        } else {
            res.status(401).json({reason: "Você não tem permissão para apagar esse vídeo... Suspeito... Certeza que está na conta correta?"})
        }
    }


})

module.exports = router