document.addEventListener("DOMContentLoaded", function () {
    
    const likeButton = document.querySelector("#like")
    const shareButton = document.querySelector("#please")
    const dislikeButton = document.querySelector("#dislike")

    function choose(button, confirm) {
        if (confirm) {
            button.classList.replace("reactionButtonOff", "reactionButtonOn")
        } else {
            button.classList.replace("reactionButtonOn", "reactionButtonOff")
        }
    }

    likeButton.addEventListener("click", function () {
        if (likeButton.classList.contains("reactionButtonOff")) {
            choose(dislikeButton, false)
            choose(likeButton, true)
        } else {
            choose(likeButton, false)
        }
    })

    dislikeButton.addEventListener("click", function () {
        if (dislikeButton.classList.contains("reactionButtonOff")) {
            choose(likeButton, false)
            choose(dislikeButton, true)
        } else {
            choose(dislikeButton, false)
        }
    })

    shareButton.addEventListener("click", function() {
        choose(shareButton, shareButton.classList.contains("reactionButtonOff"))
    })

    const tags = document.querySelectorAll(".enabledTagButton")

    for (let i=0; i <= tags.length -1; i++) {
        const tag = tags[i]
        tag.addEventListener("click", function() {
            window.location.href = "http://localhost:3000/tag/" + tag.innerText
        })
    }

})