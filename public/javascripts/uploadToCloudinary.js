async function uploadToCloudinary(file, uploadData, type = "video", onProgress) { // type = vídeo significa que, se n for passado nada, type vai ser 'video'
    return new Promise((resolve, reject) => {

        const url = `https://api.cloudinary.com/v1_1/${uploadData.cloud_name}/${type}/upload`

        const formData = new FormData()

        formData.append("file", file)
        formData.append("api_key", uploadData.api_key)
        formData.append("timestamp", uploadData.timestamp)
        formData.append("signature", uploadData.signature)
        formData.append("folder", uploadData.folder)

        const xhr = new XMLHttpRequest()

        xhr.open("POST", url)

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && typeof onProgress == "function") {
                const percent = Math.round((event.loaded * 100) / event.total)
                onProgress(percent)
            }
        }

        xhr.onload = () => {
            if (xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText))
            } else {
                reject(new Error("Upload deu ruim: " + xhr.statusText))
            }
        }

        xhr.onerror = () => {
            reject(new Error("Falha na rede do upload :ç"))
        }

        xhr.send(formData)

    })

}

export default uploadToCloudinary