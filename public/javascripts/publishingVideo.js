function toggleTagButton(button) {

    const on = !activeTags.find((tag) => tag == button.innerHTML)

    if (on) {

        if (activeTags.length == 3) {
            return
        }
    
        let tag = button.innerHTML
        tag = tag.replace(/[^\p{L}\p{N}]/gu, '');
        activeTags.push(tag)

        button.classList.replace("disabledTagButton", "enabledTagButton")
        button.style.backgroundColor = button.dataset.color

    } else {
        const tag = button.innerHTML
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
        helper.classList.add("invisible")
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

    publishButton.addEventListener("click", function () {
        const title = titleInput.value
        helper.classList.remove("invisible")
        insertLine("-----------------")

        if (!(title.length > 1 && title.length < 48)) {
            return
        }

        const formData = new FormData()

        formData.append("title", title)
        formData.append("description", descriptionInput.value)
        formData.append("tags", JSON.stringify(activeTags))
        formData.append("thumbnail", thumbnailFileInput.files[0])
        formData.append("video", videoFileInput.files[0])

        const xhr = new XMLHttpRequest()

        xhr.open("POST", "/studio/publish")

        xhr.withCredentials = true
        xhr.responseType = 'json'

        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100)
                insertLine("Estou recebendo seu vídeo... " + percent + "%")
            }
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 201) {
                    insertLine("Recebi o seu vídeo! Irei publicar ele ;)", true, true)
                } else {
                    insertLine(xhr.response.reason, true)
                }
            }
        }
        
        xhr.send(formData)
    })

})