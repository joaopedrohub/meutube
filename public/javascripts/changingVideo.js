
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

    confirmButton.addEventListener("click", function () {
        const title = titleInput.value
        helper.classList.remove("trueInvisible")

        if (!(title.length > 1 && title.length < 48)) {
            return
        }


        const formData = new FormData()

        formData.append("title", title)
        formData.append("description", descriptionInput.value)
        formData.append("thumbnail", thumbnailFileInput.files[0])

        const xhr = new XMLHttpRequest()

        const url = new URL(window.location.href)
        const nodes = url.pathname.split('/')
        const videoId = nodes[nodes.length - 1]

        xhr.open("PUT", "/studio/change/" + videoId)

        xhr.withCredentials = true
        xhr.responseType = 'json'

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    insertLine("Seu vídeo foi editado com sucesso! :D", true, true)
                } else {
                    insertLine(xhr.response.reason, true)
                }
            }
        }

        xhr.send(formData)
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