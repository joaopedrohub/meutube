function toggleTagButton(button) {

    const on = !activeTags.find((tag) => tag == button.innerHTML)

    if (on) {
        
        if (activeTags.length == 3) {
            return 
        }

        const tag = button.innerHTML
        activeTags.push(tag)

        button.classList.replace("disabledTagButton", "enabledTagButton")
        button.style.backgroundColor = button.dataset.color

    } else {
        const tag = button.innerHTML
        const index = activeTags.findIndex((otherTag) => tag == otherTag)
        if (index> -1) {
            activeTags.splice(index, 1)
            button.classList.replace("enabledTagButton", "disabledTagButton")
            button.style.backgroundColor = ''
        } 
    }
    console.log(activeTags)
}

var activeTags = []

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



    var allTagButtons = document.querySelector("#tagBox").children

    for (var i = 0; i < allTagButtons.length; i++) {
        const button = allTagButtons[i]
        button.addEventListener("click", function() {
            toggleTagButton(button)
        })
    }

    const publishButton = document.querySelector(".myButton")

    publishButton.addEventListener("click", function() {
        const title = titleInput.value

        if (!(title.length > 1 && title.length < 48)) {
            return
        }

        const formData = new FormData()

        formData.append("title", title)
        formData.append("description", descriptionInput.value)
        formData.append("tags", JSON.stringify(activeTags))
        formData.append("thumbnail", thumbnailFile.files[0])
        formData.append("video", videoFile.files[0])

        const xhr = new XMLHttpRequest()

        xhr.open("POST", "/publish")

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

})