const jwt = require("jsonwebtoken")

const secretKey = "chavezinhaSecreta:3"

function authTokenMiddleware(req, res, next) {
    const authenticationHeader = req.headers['authorization']
    
    const token = authenticationHeader && authenticationHeader.split(' ')[1]

    if (!token) return res.sendStatus(401)
    
    jwt.verify(token, secretKey, (error, channel) => {
        if (error) return res.sendStatus(403)
        req.channel = channel
        next()
    })
    
}

module.exports = { authTokenMiddleware, secretKey }