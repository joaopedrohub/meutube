document.addEventListener("DOMContentLoaded", function () {

    const nameInput = document.querySelector("#name")
    const passwordInput = document.querySelector("#password")
    const colorInput = document.querySelector("#color")
    const infoText = document.querySelector("#infoText")

    const createButton = document.querySelector("#create")

    const nameRegex = /[^\w]/
    const passwordRegex = nameRegex

    function toggleCreateButton(on) {
        if (on) {
            createButton.classList.remove("disabledMyButton")
            createButton.classList.add("myButton")
            createButton.disabled = false
        } else {
            createButton.classList.remove("myButton")
            createButton.classList.add("disabledMyButton")
            createButton.disabled = true
        }
    }

    function updateInputs() {
        const name = nameInput.value
        const password = passwordInput.value

        let needsToDisableButton = false

        if (name.match(nameRegex)) {
            nameInput.classList.add("invalidInput")
            needsToDisableButton = true
        } else {
            nameInput.classList.remove("invalidInput")
        }

        if (password.match(passwordRegex)) {
            needsToDisableButton = true
            passwordInput.classList.add("invalidInput")
        } else {
            passwordInput.classList.remove("invalidInput")
        }


        if (name.length <= 3 || name.length > 12) {
            needsToDisableButton = true
        }

        if (password.length <= 3 || password.length > 12) {
            needsToDisableButton = true
        }

        toggleCreateButton(!needsToDisableButton)

        return true
    }

    updateInputs()

    nameInput.addEventListener("input", updateInputs)

    passwordInput.addEventListener("input", updateInputs)

    createButton.addEventListener("click", function () {

        nameInput.readOnly = true
        passwordInput.readOnly = true
        createButton.disabled = true

        const name = nameInput.value
        const password = passwordInput.value
        const color = colorInput.value

        fetch('/gate/signin', {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ name: name, password: password, color: color })
        })
            .then(async response => {
                const status = response.status
                let data

                try {
                    data = await response.json()
                } catch (error) {
                    data = {}
                }

                return { status, data }
            })
            .then(result => {

                if (result.status == 200) {
                    window.location.href = "http://localhost:3000/"
                } else {
                    infoText.innerText = result.data.reason
                }

            })
            .catch(error => {
                console.warn(error.stack)
            })

        nameInput.readOnly = false
        passwordInput.readOnly = false
        createButton.disabled = false


    })

})