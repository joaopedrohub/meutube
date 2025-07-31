const cloudinary = require("./Cloudinary")

function uploadToCloudinary(buffer, folder, resourceType = "auto") {

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: resourceType
            },
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }
        )
    })
}

module.exports = uploadToCloudinary