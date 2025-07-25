document.addEventListener("DOMContentLoaded", function () {
    
    var buttons = document.querySelectorAll("#videoButton");
    buttons.forEach(function (button) {
        var children = button.children;
        var div = button.parentElement
        var thumbnail = null;

        for (let i = 0; i < children.length; i++) {
            var child = children[i];

            if (child.className === "thumbnail") {
                thumbnail = child;
                break;
            }
        }

        if (thumbnail) {
            button.addEventListener("mouseenter", function () {
                div.style.backgroundColor = "#444444"
            });

            button.addEventListener("mouseleave", function () {
                div.style.backgroundColor = "#111111"
            });
        }

        button.addEventListener("click", function () {
            console.log(button.dataset.id)
            window.location.href = "/theater/" + button.dataset.id;
        });
    
    });
});
