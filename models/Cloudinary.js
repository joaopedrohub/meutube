const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME="dnn0uuian",
    api_key: process.env.CLOUDINARY_API_KEY="566779733444385",
    api_secret: process.env.CLOUDINARY_API_SECRET="ab-iFMiMlLTjQeEvLcMxepbC-YM"
})

module.exports = cloudinary