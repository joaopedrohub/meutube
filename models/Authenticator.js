const db = require("../testdb")
const jwt = require("jsonwebtoken")

const secretKey = "chavezinhaSecreta:3"

function authTokenMiddleware(req, res, next) {

    const authenticationHeader = req.headers['authorization']

    const token = (authenticationHeader && authenticationHeader.split(' ')[1]) || req.cookies.token

    if (!token) { return res.status(401).render("unlogged") }

    jwt.verify(token, secretKey, (error, channel) => {
        if (error) { return res.status(403).render("unlogged") }
        if (db.channels.find((databaseChannel) => databaseChannel.id == channel.id)) {

            req.channel = channel
            next()

        } else {
            return res.status(401).render("unlogged") // na verdade é não autorizado
        }

    })

}

module.exports = { authTokenMiddleware, secretKey }