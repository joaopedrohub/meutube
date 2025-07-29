
const jwt = require("jsonwebtoken")

const secretKey = "chavezinhaSecreta:3"

function authTokenMiddleware(req, res, next) {

    const authenticationHeader = req.headers['authorization']

    const token = (authenticationHeader && authenticationHeader.split(' ')[1]) || req.cookies.token

    if (!token) { return res.status(401).render("unlogged") }

    const prisma = require("../prisma/client")

    jwt.verify(token, secretKey, (error, channel) => {
        if (error) { return res.status(403).render("unlogged") }
        req.channel = channel
        return next()
    })

}

//apenas checa se o usuário está logado ou não. Não retorna qual o canal.
function isLoggedMiddleware(req, res, next) {
    const authenticationHeader = req.headers['authorization']

    const token = (authenticationHeader && authenticationHeader.split(' ')[1]) || req.cookies.token

    if (!token) { req.logged = false; return next() }

    jwt.verify(token, secretKey, (error) => {
        if (error) {
            req.logged = false
            return next()
        }
        req.logged = true
        return next()
    })

}

module.exports = { authTokenMiddleware, isLoggedMiddleware, secretKey }