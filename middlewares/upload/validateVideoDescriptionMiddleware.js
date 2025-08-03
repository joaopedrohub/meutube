//Verifica se o título é válido

const cleanupUploadedFiles = require("../../utils/cleanupUploadedFiles")

async function validateVideoDescriptionMiddleware(req, res, next) {

    const videoDescriptionRegex = /[^\w|^\s|^[\-!@#$%&*()=\[\]\{\},.;:/?'"£¢¹²³§`^~<>°\|]]/

    const body = req.body
    const description = body.description
    if (!(typeof description === "string")) {
        await cleanupUploadedFiles(req)
        return res.status(400).json({reason: "A descrição que você enviou não é uma string... Como você fez isso? '~'"})
    }

    if (description.length > 1000) {
        await cleanupUploadedFiles(req)
        return res.status(400).json({reason: "Sua descrição é grande demais. Precisa ter no máximo 1000 caracteres. >:("})
    }

    const match = description.match(videoDescriptionRegex)

    if (match) {
        await cleanupUploadedFiles(req)
        return res.status(400).json({reason: "Sua descrição tem um caractere que não pode: " + "'" + match + "'. '^'"})
    }
    console.log("next do description")
    return next()

}

module.exports = validateVideoDescriptionMiddleware