document.addEventListener("DOMContentLoaded", function() {

    const nameInput = document.querySelector("#name")
    const passwordInput = document.querySelector("#password")
    const colorInput = document.querySelector("#color")

    const createButton = document.querySelector("#create")

    const nameRegex = /[^\w]/
    const passwordRegex = /[^\w]/

    function updateCreateButton() {
        const name = nameInput.value
        const password = passwordInput.value

        if (name.length <= 3 || name.length > 12) {
            createButton.classList.add("disabledMyButton")
            return false
        }   

        if (password.length <=3 || password.length > 12) {
            createButton.classList.add("disabledMyButton")
            return false
        } 

        createButton.classList.remove("disabledMyButton")

        return true
    } 

    updateCreateButton()

    nameInput.addEventListener("input", function() {
        if (!updateCreateButton()) {
            return
        }
        const name = nameInput.value
        if (name.match(nameRegex)) {
            nameInput.classList.add("invalidInput")
            createButton.classList.add("disabledMyButton")
        } else {
            nameInput.classList.remove("invalidInput")
            createButton.classList.remove("disabledMyButton")
        }

       
    }) 

    passwordInput.addEventListener("input", function() {
        if (!updateCreateButton()) {
            return
        }
        const password = passwordInput.value 
        if (password.match(passwordRegex)) {
            passwordInput.classList.add("invalidInput")
            createButton.classList.add("disabledMyButton")
        } else {
            passwordInput.classList.remove("invalidInput")
            createButton.classList.remove("disabledMyButton")
        }

    })

    createButton.addEventListener("click", function() {

        const name = nameInput.value
        const password = passwordInput.value
        const color = colorInput.value

        fetch('/gate/signin', {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({name: name, password: password, color: color})
        })
        .then(response => response.json())
        .then(data => {
            document.cookie = `token=${data.token}; path=/; max-age=86400` // depois manda o cookie pelo backend
            console.log("cookie feito!")
            window.location.href = "localhost:3000/"
        }) 
        .catch(error => {
            console.warn(error.stack)
        })

    })

})