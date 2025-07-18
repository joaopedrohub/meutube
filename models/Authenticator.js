const jwt = require("jsonwebtoken")

const secretKey = "chavezinhaSecreta:3"

function authTokenMiddleware(req, res, next) {
    const authenticationHeader = req.headers['authorization']
    
    const token = authenticationHeader && authenticationHeader.split(' ')[1]

    if (!token) return res.sendStatus(401); res.render("unlogged")
    
    jwt.verify(token, secretKey, (error, channel) => {
        if (error) return res.status(403); res.render("unlogged")
        req.channel = channel
        next()
    })
    
}

module.exports = { authTokenMiddleware, secretKey }