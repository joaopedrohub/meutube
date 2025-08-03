var express = require('express');
var router = express.Router();

const getUserChannelMiddleware = require("../../middlewares/authentication/getUserChannelMiddleware")
const studioController = require("../../controllers/studio/studioController")

router.get("/", getUserChannelMiddleware, studioController.renderStudioPage)

module.exports = router