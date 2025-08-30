document.addEventListener("DOMContentLoaded", function () {

    const deleteChannelButton = document.querySelector("#deleteChannel")
    const leaveChannelButton = document.querySelector("#leaveChannel")

    leaveChannelButton.addEventListener("click", function () {
        fetch("/gate/logout", {
            method: 'POST',
            credentials: 'include' // aparentemente o cookie precisa ser enviado explicitamente desse jeito :(
        }).then(() => {
            window.location.href = "/gate/login"
        })
    })

    deleteChannelButton.addEventListener("click", function () {
        fetch("/channel", {
            method: "DELETE",
            credentials: "include"
        }).then(async response => {
            const status = response.status

            if (status == 204) {
                window.location.href = "/gate/signin"
            }
        })
    })




})