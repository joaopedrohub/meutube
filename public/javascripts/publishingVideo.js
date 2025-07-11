function toggleTagButton(button) {

    const on = !activeTags.find((tag) => tag == button.innerHTML)

    if (on) {
        
        if (activeTags.length == 3) {
            return 
        }

        const tag = button.innerHTML
        activeTags.push(tag)

        button.classList.replace("disabledTagButton", "enabledTagButton")

    } else {
        const tag = button.innerHTML
        const index = activeTags.findIndex((otherTag) => tag == otherTag)
        if (index> -1) {
            activeTags.splice(index, 1)
            button.classList.replace("enabledTagButton", "disabledTagButton")
        } 
    }
    console.log(activeTags)
}

var activeTags = []

document.addEventListener("DOMContentLoaded", function () {

    const titleInput = document.querySelector("#title")
    const videoTitle = document.querySelector("#videoTitle")
    
    document.addEventListener("input", (event) => {
        videoTitle.innerHTML = titleInput.value
    })

    const thumbnail = document.querySelector(".thumbnail")
    const thumbnailFile = document.querySelector("#thumbnailFile")

    thumbnailFile.addEventListener("change", function() {
        const file = this.files[0]
        if (file) {
            thumbnail.src = URL.createObjectURL(file)  
        } else {

        }
    })



    var allTagButtons = document.querySelector("#tagBox").children

    for (var i = 0; i < allTagButtons.length; i++) {
        const button = allTagButtons[i]
        button.addEventListener("click", function() {
            toggleTagButton(button)
        })
    }

})