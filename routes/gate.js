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
            return res.status(400).json({reason: "Nome ou senha contém caractéres inválidos"})
        }

        const nameTaken = db.channels.find((channel) => channel.name.toLowerCase() == body.name.toLowerCase())
        if (nameTaken) {
            res.status(401).json({reason: "Outro canal já tem esse nome."})
        }

        if (!body.color.match(validator.hexColorRegex)) {
            res.status(400).json({reason: "A cor que você mandou não é um hex válido."})
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

        res.status(200).json({token: token})
        
    } else {
        res.status(400).json({reason: "Falta informação."})
    }
})

router.post('/login', function(req,res) {
    const body = req.body
    const requiredInfo = ['name', 'password']
    const hasNecessaryInfo = requiredInfo.every((property) => body.hasOwnProperty(property))
    if (hasNecessaryInfo) {

        if (body.name.match(validator.nonAlphanumericRegex) || body.password.match(validator.nonAlphanumericRegex)) {
            
            return res.sendStatus(400)
        }
        
        const channel = db.channels.find((channel) => channel.name === body.name && channel.password === body.password)

        if (!channel) {
            res.sendStatus(401)
        }

        const token = jwt.sign({id: channel.id, name: body.name}, secretKey, {expiresIn: '24h'})

        res.status(200).json({token}).redirect("/")
    } else {
        res.sendStatus(400)
    }
})


module.exports = router;
