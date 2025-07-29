document.addEventListener("DOMContentLoaded", function () {

    const nameInput = document.querySelector("#name")
    const passwordInput = document.querySelector("#password")
    const loginButton = document.querySelector("#login")
    const infoText = document.querySelector("#infoText")

    const nameRegex = /[^\w]/
    const passwordRegex = nameRegex

    function toggleLoginButton(on) {
        if (on) {
            loginButton.classList.remove("disabledMyButton")
            loginButton.classList.add("myButton")
            loginButton.disabled = false
        } else {
            loginButton.classList.remove("myButton")
            loginButton.classList.add("disabledMyButton")
            loginButton.disabled = true
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

        toggleLoginButton(!needsToDisableButton)

        return true
    }

    updateInputs()

    nameInput.addEventListener("input", updateInputs)

    passwordInput.addEventListener("input", updateInputs)

    loginButton.addEventListener("click", function () {

        nameInput.readOnly = true
        passwordInput.readOnly = true
        loginButton.disabled = true

        const name = nameInput.value
        const password = passwordInput.value

        fetch("/gate/login", {
            method: "POST",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify({ name: name, password: password })
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
                    
                    
                } else if (result.status == 401) {
                    infoText.innerText = "Nome ou senha incorretos"
                } else if (result.status == 400) {
                    infoText.innerText = "Falta informação"
                } else {
                    infoText.innerText = "Erro desconhecido"
                }


            })
        
        nameInput.readOnly = false
        passwordInput.readOnly = false
        loginButton.disabled = false
        
    })
})