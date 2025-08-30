document.addEventListener("DOMContentLoaded", function () {

    const tags = document.querySelectorAll(".enabledTagButton")

    for (let i=0; i <= tags.length -1; i++) {
        const tag = tags[i]
        tag.addEventListener("click", function() {
            window.location.href = "http://localhost:3000/tag/" + tag.innerText
        })
    }

})