const cloudinary = require("../config/cloudinary")

async function deleteBySecureURL(secureUrls) {

    if (typeof secureUrls == "string") {
        secureUrls = [secureUrls]
    } else if (typeof secureUrls == "object") {
        if (secureUrls.length == 0) {
            return 
        }
        // é o intencional, pra que seja possível destruir vários arquivos de uma vez
        // mas pra praticidade, você também pode só passar uma string
    }

    let allPublicIds = []

    try {

        for (const url of secureUrls) {
            const urlPath = new URL(url).pathname
            const uploadIndex = urlPath.indexOf("/upload/") // pegar só o que tá depois do /upload/
            const publidIdWithExtension = urlPath.substring(uploadIndex + 8) // remove o /upload/

            const publicId = publidIdWithExtension.replace(/\.[^/.]+$/, '')
            allPublicIds.push(publicId)
        }


        const result = await cloudinary.api.delete_resources(allPublicIds)

        return result

    } catch (error) {
        console.error("Erro ao deletar arquivos:" + error)
        throw error
    }
}

module.exports = {
    deleteBySecureURL
}