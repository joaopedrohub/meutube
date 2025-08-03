var express = require('express');
var router = express.Router();

const changeController = require("../../controllers/studio/changeController")

const validateVideoChangeFilesMiddleware = require("../../middlewares/upload/validateVideoChangeFilesMiddleware")
const validateVideoTitleMiddleware = require("../../middlewares/upload/validateVideoTitleMiddleware")
const validateVideoDescriptionMiddleware = require("../../middlewares/upload/validateVideoDescriptionMiddleware")
const getUserChannelMiddleware = require("../../middlewares/authentication/getUserChannelMiddleware")

router.get("/:id", getUserChannelMiddleware, changeController.renderChangePage)

router.put("/:id", validateVideoChangeFilesMiddleware, validateVideoTitleMiddleware, validateVideoDescriptionMiddleware, getUserChannelMiddleware, changeController.changeVideo)

router.delete("/:id", getUserChannelMiddleware, changeController.deleteVideo)


module.exports = router