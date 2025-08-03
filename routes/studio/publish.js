var express = require('express');
var router = express.Router();

const publishController = require("../../controllers/studio/publishController")

const validateVideoTitle = require("../../middlewares/upload/validateVideoTitleMiddleware")
const validateVideoDescription = require("../../middlewares/upload/validateVideoDescriptionMiddleware")
const validateVideoTags = require("../../middlewares/upload/validateVideoTagsMiddleware")
const { validateFileSizesMiddleware, publishVideoMiddleware } = require("../../middlewares/upload/validateVideoFilesMiddlewares");
const getUserChannelMiddleware = require('../../middlewares/authentication/getUserChannelMiddleware');

router.get("/", getUserChannelMiddleware, publishController.renderPublishPage)

router.post("/",
    publishVideoMiddleware,
    validateFileSizesMiddleware,
    getUserChannelMiddleware,
    validateVideoTitle,
    validateVideoDescription,
    validateVideoTags,
    publishController.publishVideo)

module.exports = router