var express = require('express');
var router = express.Router();

const publishController = require("../../controllers/studio/publishController")

const validateVideoTitle = require("../../middlewares/upload/validateVideoTitleMiddleware")
const validateVideoDescription = require("../../middlewares/upload/validateVideoDescriptionMiddleware")
const validateVideoTags = require("../../middlewares/upload/validateVideoTagsMiddleware")
const getUserChannelMiddleware = require('../../middlewares/authentication/getUserChannelMiddleware');
const {validateCloudinaryPublishMiddleware} = require("../../middlewares/upload/validateCloudinaryUploadMiddlewares")

const sucessMessages = require("../../utils/messages/sucessMessages")
const problemMessages = require("../../utils/messages/problemMessages")

router.get("/", getUserChannelMiddleware, publishController.renderPublishPage)

router.post("/",
    getUserChannelMiddleware,
    validateVideoTitle,
    validateVideoDescription,
    validateVideoTags,
    publishController.publishVideo
)


router.post("/confirm", validateCloudinaryPublishMiddleware, getUserChannelMiddleware, validateVideoTitle, validateVideoDescription, validateVideoTags, async function (req, res) {
    const prisma = require("../../prisma/client")

    if (!req.channel) {
        res.status(401).json({ reason: problemMessages.unlogged})
    }

    const videoInfo = req.cloudinary.video
    const thumbnailInfo = req.cloudinary.thumbnail

    let newVideo

    try {
        newVideo = await prisma.video.create({
            data: {
                title: req.body.title,
                description: req.body.title,
                channelId: req.channel.id,
                videoFileName: videoInfo.secure_url,
                thumbnailFileName: thumbnailInfo.secure_url,

                tags: {
                    connect: req.body.tags.map((name) => ({name}))
                }
            }
        })
    } catch (error) {
        console.log("Erro ao criar o vídeo")
        return res.status(500).json({reason: "Vídeo precisa ter esses formatos: MP4 ou MOV ou MKV ou AVI."})
    }

    res.status(201).json({sucess: true})
})

module.exports = router

