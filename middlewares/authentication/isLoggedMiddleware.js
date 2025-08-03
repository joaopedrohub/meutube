// A função desse middleware é apenas de verificar se o usuário está ou não logado.
// Vai passar essa informação através do req.logged.

const jwt = require("jsonwebtoken")

function isLoggedMiddleware(req, res, next) {
    const authenticationHeader = req.headers['authorization']

    const token = (authenticationHeader && authenticationHeader.split(' ')[1]) || req.cookies.token

    if (!token) { req.logged = false; return next() }

    jwt.verify(token, process.env.SECRET_KEY, (error) => {
        if (error) {
            req.logged = false 
            return next()
        }
        req.logged = true
        return next()
    })

}

module.exports = isLoggedMiddleware