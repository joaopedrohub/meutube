var express = require('express');
var router = express.Router();

const cloudinaryCRUD = require("../../utils/cloudinaryCRUD")

const changeController = require("../../controllers/studio/changeController")

const validateVideoTitleMiddleware = require("../../middlewares/upload/validateVideoTitleMiddleware")
const validateVideoDescriptionMiddleware = require("../../middlewares/upload/validateVideoDescriptionMiddleware")
const getUserChannelMiddleware = require("../../middlewares/authentication/getUserChannelMiddleware")
const {validateCloudinaryChangeMiddleware} = require("../../middlewares/upload/validateCloudinaryUploadMiddlewares")

const sucessMessages = require("../../utils/messages/sucessMessages")
const problemMessages = require("../../utils/messages/problemMessages")

router.get("/:id", getUserChannelMiddleware, changeController.renderChangePage)

router.put("/:id", validateVideoTitleMiddleware, validateVideoDescriptionMiddleware, getUserChannelMiddleware, changeController.changeVideo)

router.put("/:id/confirm", validateCloudinaryChangeMiddleware, getUserChannelMiddleware, validateVideoTitleMiddleware, validateVideoDescriptionMiddleware, async function(req, res) {
    const prisma = require("../../prisma/client")

    // por mais que seja a rota de confirmar, ela só é ativada quando o usuário quer mudar a thumb do vídeo

    if (!req.channel) {
        res.status(401).json({reason: problemMessages.unlogged})
    }

    const thumbnailInfo = req.cloudinary.thumbnail

    let videoId = parseInt(req.params.id)

    let video

    try {
        video = await prisma.video.findFirst({
            where: {id: videoId}
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({reason: problemMessages.databaseError})
    }

    if (video.channelId == req.channel.id || req.channel.admin) {

        try {

            await prisma.video.update({
                where: {id: videoId},
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    thumbnailFileName: thumbnailInfo.secure_url
                }
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({reason: problemMessages.databaseError})
            
        }
        
        await cloudinaryCRUD.deleteBySecureURL(video.thumbnailFileName)

        res.status(200).json({reason: sucessMessages.videoChangedWithSucess})
    }
    




})

router.delete("/:id", getUserChannelMiddleware, changeController.deleteVideo)


module.exports = router