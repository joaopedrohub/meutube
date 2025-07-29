var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken")
const { authTokenMiddleware, secretKey } = require('../models/Authenticator')
const Validator = require("../models/Validator")
const Channel = require("../models/Channel")



const validator = new Validator()
const hexColorRegex = /^#[0-9A-F]{6}$/i

router.get('/signin', function (req, res, next) {
    res.render("signin")
});

router.get('/login', function (req, res) {
    res.render("login")
})

router.post('/signin', async function (req, res) {
    const body = req.body

    const prisma = require('../prisma/client');

    const requiredInfo = ['name', 'password', 'color']
    const hasNecessaryInfo = requiredInfo.every((property) => body.hasOwnProperty(property))

    if (hasNecessaryInfo) {

        if (body.name.match(validator.nonAlphanumericRegex) || body.password.match(validator.nonAlphanumericRegex)) {
            return res.status(400).json({ reason: "Nome ou senha contém caractéres inválidos" })
        }
        let nameTaken = false

        try {
            nameTaken = await prisma.channel.findFirst({ where: { name: body.name } })
        } catch (error) {
            console.error(error)
            res.status(500).json({ reason: "Um erro ocorreu ao criar a sua conta. Tente novamente." })
        }

        if (nameTaken) {
            res.status(401).json({ reason: "Outro canal já tem esse nome." })
        }

        if (!body.color.match(validator.hexColorRegex)) {
            res.status(400).json({ reason: "A cor que você mandou não é um hex válido." })
        }

        let newChannel

        try {
            newChannel = await prisma.channel.create({
                data: {
                    name: body.name,
                    password: body.password,
                    color: body.color
                }
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ reason: "Um erro ocorreu ao criar a sua conta. Tente novamente." })
        }

        if (newChannel) {

            const channelPayload = {
                id: newChannel.id,
                name: newChannel.name,
                color: newChannel.color
            }

            const token = jwt.sign(channelPayload, secretKey, { expiresIn: '24h' })
            res.cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 60 * 60 * 24 * 1000,
                    path: "/"

                })
            res.status(200).redirect("/")
        }

    } else {
        res.status(400).json({ reason: "Falta informação." })
    }
})

router.post('/login', async function (req, res) {
    const body = req.body
    const requiredInfo = ['name', 'password']
    const hasNecessaryInfo = requiredInfo.every((property) => body.hasOwnProperty(property))
    if (hasNecessaryInfo) {

        const prisma = require('../prisma/client');

        if (body.name.match(validator.nonAlphanumericRegex) || body.password.match(validator.nonAlphanumericRegex)) {

            return res.sendStatus(400)
        }

        let channel

        try {

            channel = await prisma.channel.findFirst({
                where: {
                    name: body.name
                }
            })

        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }

        if (channel) {
            if (channel.password == body.password) {
                const token = jwt.sign({ id: channel.id, name: body.name }, secretKey, { expiresIn: '24h' })
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 60 * 60 * 24 * 1000,
                    path: "/"

                })
                return res.status(200).redirect("/")
            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(401)
        }
        




    } else {
        res.sendStatus(400)
    }
})


module.exports = router;
