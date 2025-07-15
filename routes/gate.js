var express = require('express');
var router = express.Router();


const Validator = require("../models/Validator")
const Channel = require("../models/Channel")
const db = require("../testdb")

const validator = new Validator()

router.get('/signin', function(req, res, next) {
    res.render("signin")
});

router.post('/signin', function(req,res) {
    const body = req.body

    const requiredInfo = ['name', 'password', 'color']
    const hasNecessaryInfo = requiredInfo.every((property) => body.hasOwnProperty(property))

    if (hasNecessaryInfo) {

        if (!validator.isAlphanumericString(string)) {
            return
        }

        const nameTaken = db.channels.find((channel) => channel.name == body.name)
        if (nameTaken) {
            return
        }

        const newChannel = new Channel(body.name, body.password)
        newChannel.color = body.color
        newChannel.id = db.channels.push(newChannel) - 1

        console.log("Canal " + body.name + " criado!")

    }
})



module.exports = router;
