
document.addEventListener("DOMContentLoaded", function () {

    const titleInput = document.querySelector("#title")
    const videoTitle = document.querySelector("#videoTitle")
    const descriptionInput = document.querySelector("#description")

    document.addEventListener("input", (event) => {
        videoTitle.innerHTML = titleInput.value
    })

    const thumbnail = document.querySelector(".thumbnail")
    const thumbnailFile = document.querySelector("#thumbnailFile")
    const videoFile = document.querySelector("#videoFile")

    thumbnailFile.addEventListener("change", function() {
        const file = this.files[0]
        if (file) {
            thumbnail.src = URL.createObjectURL(file)  
        } else {
            thumbnail.src = "/defaultThumbnail.png"
        }
    })

    const confirmButton = document.querySelector("#confirmButton")
    const deleteButton = document.querySelector("deleteButton")

    confirmButton.addEventListener("click", function() {
        const title = titleInput.value

        if (!(title.length > 1 && title.length < 48)) {
            return
        }

        const formData = new FormData()

        formData.append("title", title)
        formData.append("description", descriptionInput.value)
        formData.append("thumbnail", thumbnailFile.files[0])

        const xhr = new XMLHttpRequest()

        xhr.open("POST", "/studio/change")

        xhr.withCredentials = true

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log(xhr.responseText)
                }
            }
        }

        xhr.send(formData)
    })

    deleteButton.addEventListener("click", function() {
        const videoId = path.match(/studio\/change\/([^/]+)/);

        const xhr = new XMLHttpRequest()

        xhr.open("DELETE", "/studio/change/" + videoId)
        xhr.withCredentials = true

    })

})