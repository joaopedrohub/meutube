import uploadToCloudinary from "./uploadToCloudinary.js"

function toggleTagButton(button) {
    const on = !activeTags.find((tag) => tag == button.innerText)
    if (on) {

        if (activeTags.length == 3) {
            return
        }

        let tag = button.innerText
        tag = tag.replace(/[^\p{L}\p{N}]/gu, '');
        activeTags.push(tag)

        button.classList.replace("disabledTagButton", "enabledTagButton")
        button.style.backgroundColor = button.dataset.color

    } else {
        let tag = button.innerText
        tag = tag.replace(/[^\p{L}\p{N}]/gu, '');
        const index = activeTags.findIndex((otherTag) => tag == otherTag)
        if (index > -1) {
            activeTags.splice(index, 1)
            button.classList.replace("enabledTagButton", "disabledTagButton")
            button.style.backgroundColor = ''
        }
    }
}

let activeTags = []

document.addEventListener("DOMContentLoaded", function () {

    const titleInput = document.querySelector("#title")
    const videoTitle = document.querySelector("#videoTitle")
    const descriptionInput = document.querySelector("#description")
    const helper = document.querySelector("#helper")
    const helperTextArea = document.querySelector("#helperTextArea")
    const helperButton = helper.querySelector("button")
    const thumbnail = document.querySelector(".thumbnail")
    const thumbnailFileInput = document.querySelector("#thumbnailFile")
    const videoFileInput = document.querySelector("#videoFile")
    const publishButton = document.querySelector("#publishButton")

    function setThumbnailPreview(file) {
        if (file) {
            thumbnail.src = URL.createObjectURL(file)
        } else {
            thumbnail.src = "/defaultThumbnail.png"
        }
    }

    function updatePublishButton() {
        if (titleInput.value.length > 0 && titleInput.value.length <= 48 && thumbnailFileInput.files[0] && videoFileInput.files[0]) {
            publishButton.classList.remove("disabledMyButton")
            publishButton.classList.add("myButton")
            publishButton.disabled = false
        } else {
            publishButton.classList.remove("myButton")
            publishButton.classList.add("disabledMyButton")
            publishButton.disabled = true
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

    titleInput.addEventListener("input", (event) => {
        videoTitle.innerHTML = titleInput.value
        updatePublishButton()
    })

    thumbnailFileInput.addEventListener("change", function () {
        const file = thumbnailFileInput.files[0]
        setThumbnailPreview(file)
        updatePublishButton()
    })

    videoFileInput.addEventListener("change", function () {
        const file = videoFileInput.files[0]
        updatePublishButton()
    })

    helperButton.addEventListener("click", function () {
        helper.classList.add("trueInvisible")
        helperButton.classList.replace("myButton", "disabledMyButton")
        helperButton.disabled = true
    })

    let allTagButtons = document.querySelector("#tagBox").children

    //colocar os eventos das tags
    for (let i = 0; i < allTagButtons.length; i++) {
        const button = allTagButtons[i]
        button.addEventListener("click", function () {
            toggleTagButton(button)
        })
    }

    updatePublishButton()
    if (thumbnailFileInput.files[0]) { setThumbnailPreview(thumbnailFileInput.files[0]) }

    publishButton.addEventListener("click", async function () {
        const title = titleInput.value
        helper.classList.remove("trueInvisible")
        insertLine("-----------------")

        const response = await fetch("/studio/publish", {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                title: title,
                description: descriptionInput.value,
                tags: activeTags
            })
        })
            .then(async response => {
                const status = response.status
                let data

                try {
                    data = await response.json()
                } catch (error) {
                    console.error(error)
                    data = {}
                }

                return { status, data }
            })
            .then(async result => {

                if (result.status == 200) {
                    insertLine("Título, descrição e tags nos conformes. Agora, seu vídeo está sendo enviado para nosso armazém...")

                    const videoFile = videoFileInput.files[0]
                    const thumbnailFile = thumbnailFileInput.files[0]
                    const uploadData = result.data.uploadData

                    const videoUpload = uploadToCloudinary(videoFile, {
                        ...uploadData.video,
                        api_key: uploadData.api_key,
                        cloud_name: uploadData.cloud_name,
                        timestamp: uploadData.timestamp
                    }, "video", (percent) => { insertLine("Progresso de envio do vídeo: " + percent + "%")})

                    const thumbnailUpload = uploadToCloudinary(thumbnailFile, {
                        ...uploadData.thumbnail,
                        api_key: uploadData.api_key,
                        cloud_name: uploadData.cloud_name,
                        timestamp: uploadData.timestamp
                    }, "image", (percent) => { insertLine("Progresso do envio da thumbnail: " + percent + "%") })

                    try {
                        const [videoResult, thumbnailResult] = await Promise.all([videoUpload, thumbnailUpload])

                        await fetch("/studio/publish/confirm", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                title: title,
                                description: descriptionInput.value,
                                tags: activeTags,
                                videoPublicId: videoResult.public_id,
                                thumbnailPublicId: thumbnailResult.public_id
                            })
                        })
                            .then(async response => {
                                const status = response.status
                                let data

                                try {
                                    data = await response.json()
                                } catch (error) {
                                    console.error(error)
                                    data = {}
                                }

                                return { status, data }
                            })
                            .then(async result => {
                                if (result.status == 201) {
                                    insertLine("Vídeo publicado. Deu tudo certo", true, true)
                                } else {
                                    insertLine(result.data.reason, true)
                                }
                            })

                    }
                    catch (error) {
                        console.log(error)
                        throw error
                    }


                } else {
                    insertLine(result.data.reason)
                }
            })
    })

})