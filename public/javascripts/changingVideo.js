import uploadToCloudinary from "./uploadToCloudinary.js"

document.addEventListener("DOMContentLoaded", function () {

    const titleInput = document.querySelector("#title")
    const videoTitle = document.querySelector("#videoTitle")
    const descriptionInput = document.querySelector("#description")
    const helper = document.querySelector("#helper")
    const helperTextArea = helper.querySelector("#helperTextArea")
    const helperButton = helper.querySelector("button")
    const thumbnail = document.querySelector(".thumbnail")
    const thumbnailFileInput = document.querySelector("#thumbnailFile")
    const confirmButton = document.querySelector("#confirmButton")
    const deleteButton = document.querySelector("#deleteButton")

    titleInput.addEventListener("input", (event) => {
        updateConfirmButton()
        videoTitle.innerHTML = titleInput.value
    })

    function updateConfirmButton() {
        if (titleInput.value.length > 0 && titleInput.value.length <= 48) {
            confirmButton.classList.remove("disabledMyButton")
            confirmButton.classList.add("myButton")
        } else {
            confirmButton.classList.remove("myButton")
            confirmButton.classList.add("disabledMyButton")
        }
    }

    function insertLine(text, enableButton, redirect) {
        helperTextArea.innerHTML += "<br>" + text
        if (enableButton) {
            helperButton.classList.replace("disabledMyButton", "myButton")
            helperButton.disabled = false
        }
        if (redirect) {
            helperButton.addEventListener("click", function () {
                window.location.href = "http://localhost:3000/channel/"
            })
        }
    }

    thumbnailFileInput.addEventListener("change", function () {
        const file = this.files[0]
        if (file) {
            thumbnail.src = URL.createObjectURL(file)
        } else {
            thumbnail.src = "/defaultThumbnail.png"
        }
    })

    updateConfirmButton()

    confirmButton.addEventListener("click", async function () {
        helper.classList.remove("trueInvisible")

        const url = new URL(window.location.href)
        const nodes = url.pathname.split('/')
        const videoId = nodes[nodes.length - 1]

        let response

        response = await fetch("/studio/change/" + videoId, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                title: titleInput.value,
                description: descriptionInput.value,
                thumbnail: thumbnailFileInput.files[0] ? true : false // true se quer mudar, false se não quer mudar
            })
        })

        const status = response.status
        let data

        if (status == 200) {
            insertLine("Seu vídeo foi editado com sucesso!", true, true)
        } else if (status == 202) {
            insertLine("Seu título e descrição estão nos conformes, agora só falta a gente receber a nova thumbnail :)")

            data = await response.json()
            const uploadData = data.uploadData
            let thumbnailUpload

            try {
                thumbnailUpload = await uploadToCloudinary(thumbnailFileInput.files[0], {
                    ...uploadData.thumbnail,
                    api_key: uploadData.api_key,
                    cloud_name: uploadData.cloud_name,
                    timestamp: uploadData.timestamp


                }, "image", (percent) => { insertLine("Progresso da thumbnail: " + percent + "%")})
            } catch (error) {
                console.error(error)
                throw error
            }

            response = await fetch(`/studio/change/${videoId}/confirm`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: titleInput.value,
                    description: descriptionInput.value,
                    thumbnailPublicId: thumbnailUpload.public_id
                })
            })

            data = await response.json()

            if (response.status == 200) {
                insertLine("Seu vídeo foi editado com sucesso!", true, true)
            } else {
                insertLine(data.reason, true)
            }

        }

    })

    deleteButton.addEventListener("click", function () {
        helper.classList.remove("trueInvisible")
        const xhr = new XMLHttpRequest()

        const url = new URL(window.location.href)
        const nodes = url.pathname.split('/')
        const videoId = nodes[nodes.length - 1]

        xhr.open("DELETE", "/studio/change/" + videoId)
        xhr.withCredentials = true
        xhr.responseType = 'json'

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    insertLine("Seu vídeo foi apagado com sucesso! >:)", true, true)
                } else {
                    insertLine(xhr.response.reason, true)
                }
            }
        }

        xhr.send()
    })

    helperButton.addEventListener("click", function () {
        helper.classList.add("trueInvisible")
        helperButton.classList.replace("myButton", "disabledMyButton")
        helperButton.disabled = true
    })

})