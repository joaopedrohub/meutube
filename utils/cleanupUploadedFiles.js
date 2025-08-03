// Essa função serve para destruir os arquivos enviados QUANDO o upload é cancelado por não estar nos conformes
// Ex: usuário manda vídeo e os arquivos estão nos conformes, mas o título não está

const fs = require("fs")
const path = require("path")

const uploadsBasePath = path.resolve(__dirname, "../uploads")

function cleanupUploadedFiles(req) {
    
    const allFiles = [
        ...(req.files.video || []),
        ...(req.files.thumbnail || [])
    ]

    for (const file of allFiles) {
        const filePath = path.join(uploadsBasePath, file.fieldname === "video" ? "videos" : "thumbnails", file.filename)
        console.log("deltando")
        fs.unlink(filePath, function(error) {
            if (error) {
                console.log("Erro ao deletar arquivo:" + error.message)
            }
        })
    }
}

module.exports = cleanupUploadedFiles