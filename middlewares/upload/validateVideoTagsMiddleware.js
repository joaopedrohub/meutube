const tagsNamesCache = [] // depois eu implemento esse cache

const cleanupUploadedFiles = require("../../utils/cleanupUploadedFiles")

async function validateMiddlewareTags(req, res, next) {
    const prisma = require("../../prisma/client")
    const tags = req.body?.tags
    

    if (!tags) {
        await cleanupUploadedFiles(req)
        return res.status(400).json({reason: "Você esqueceu de enviar quais tags vai usar no vídeo (De alguma forma, você não mandou nem uma lista vazia :<)"})
    }

    let allTags
    try {
        allTags = await prisma.tag.findMany()
    } catch (error) {
        await cleanupUploadedFiles(req)
        return res.status(500).json({reason: "Estamos tendo um problema com o banco de dados nesse momento... Desculpa..."})
    }

    let allTagNames = [] // nome de todas as tags que existem
    allTags.forEach(tag => {
        allTagNames.push(tag.name)
    });

    let tagsToPlace = [] // tags que vão estar no vídeo de fato

    tags.forEach(tag => {
        if (allTagNames.includes(tag)) {
            tagsToPlace.push(tag)
        }
    })

    req.body.tags = tagsToPlace
    return next()
}

module.exports = validateMiddlewareTags