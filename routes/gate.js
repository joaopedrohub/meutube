var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken")
const { authTokenMiddleware, secretKey } = require('../models/Authenticator')
const Validator = require("../models/Validator")
const Channel = require("../models/Channel")
const db = require("../testdb")

const validator = new Validator()
const hexColorRegex = /^#[0-9A-F]{6}$/i

router.get('/signin', function(req, res, next) {
    res.render("signin")
});

router.get('/login', function(req, res) {
    res.render("login")
})

router.post('/signin', function(req,res) {
    const body = req.body

    const requiredInfo = ['name', 'password', 'color']
    const hasNecessaryInfo = requiredInfo.every((property) => body.hasOwnProperty(property))

    if (hasNecessaryInfo) {

        if (body.name.match(validator.nonAlphanumericRegex) || body.password.match(validator.nonAlphanumericRegex)) {
            return res.status(401)
        }

        const nameTaken = db.channels.find((channel) => channel.name == body.name)
        if (nameTaken) {
            res.status(401).json({sucess: 0, reason: "Outro canal já tem esse nome."})
        }

        if (!body.color.match(validator.hexColorRegex)) {
            res.status(401).json({sucess: 0, reason: "A cor que você mandou não é um hex válido."})
        }

        const newChannel = new Channel(body.name, body.password)
        newChannel.color = body.color
        newChannel.id = db.channels.push(newChannel) - 1

        const channelPayload = {
            id: newChannel.id,
            name: newChannel.name,
            color: newChannel.color
        }

        const token = jwt.sign(channelPayload, secretKey, {expiresIn: '24h'})

        res.json({sucess: 1, token: token})
        
    } else {
        res.status(401).json({sucess: 0, reason: "Falta informação."})
    }
})

router.post('/login', authTokenMiddleware, function(req,res) {
    const body = req.body

    const requiredInfo = ['name', 'password']
    const hasNecessaryInfo = requiredInfo.every((property) => body.hasOwnProperty(property))

    if (hasNecessaryInfo) {

        if (body.name.match(validator.nonAlphanumericRegex) || body.password.match(validator.nonAlphanumericRegex)) {
            return res.status(401)
        }
        
        const channel = db.channels.find((channel) => channel.name === body.name && channel.password === body.password)

        if (!channel) {
            res.status(401)
        }

        const token = jwt.sign({id: channel.id, name: body.name}, secretKey, {expiresIn: '24h'})

        res.json({token})
        res.redirect("/")
    } else {
        res.status(401)
    }
})


module.exports = router;
