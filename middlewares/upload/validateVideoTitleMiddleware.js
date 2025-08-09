//Verifica se o título é válido

const cleanupUploadedFiles = require("../../utils/cleanupUploadedFiles")

async function validateVideoTitleMiddleware(req, res, next) {

    const videoTitleRegex = /[^\w|^\s|^[\-!@#$%&*()=\[\]\{\},.;:/?'"£¢¹²³§`^~<>°\|]]/

    const body = req.body
    const title = body.title
    
    if (title == undefined || typeof title != "string") {
        await cleanupUploadedFiles(req)
        return res.status(400).json({reason: "Você ou não enviou um título ou enviou um título que não é uma string... Como você fez isso? '~'"})
    }
    if (title.length < 1) {
        await cleanupUploadedFiles(req)
        return res.status(400).json({reason: "Seu título é muito pequeno. Precisa ter pelo menos 1 caractere. :|"})
    }
    if (title.length > 100) {
        await cleanupUploadedFiles(req)
        return res.status(400).json({reason: "Seu título é grande demais. Precisa ter no máximo 100 caracteres. >:("})
    }

    const match = title.match(videoTitleRegex)

    if (match) {
        await cleanupUploadedFiles(req)
        return res.status(400).json({reason: "Seu título tem um caractere que não pode: " + "'" + match + "'. '^'"})
    }

    return next()

}

module.exports = validateVideoTitleMiddleware