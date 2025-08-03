// Esse middleware vai ver se o usuário que fez a requisição está logado.
// Se estiver, vai passar o canal dele através do req.channel. Caso contrário, req.channel é null
const jwt = require("jsonwebtoken")

function getUserChannelMiddleware(req, res, next) {

    const authenticationHeader = req.headers['authorization']

    const token = (authenticationHeader && authenticationHeader.split(' ')[1]) || req.cookies.token

    if (!token) { req.channel = null; return next()}

    const prisma = require("../../prisma/client")

    jwt.verify(token, process.env.SECRET_KEY, (error, channel) => {
        if (error) { req.channel = null; return next() }
        req.channel = channel
        return next()
    })

}

module.exports = getUserChannelMiddleware