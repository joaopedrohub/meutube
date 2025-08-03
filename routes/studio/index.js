const express = require('express');
const router = express.Router();

const studioRouter = require("./studio")
const publishRouter = require("./publish")
const changeRouter = require("./change")

router.use("/", studioRouter)
router.use("/publish", publishRouter)
router.use("/change", changeRouter)

module.exports = router