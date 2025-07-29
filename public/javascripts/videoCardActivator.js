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

        button.addEventListener("click", function () {
            window.location.href = "/theater/" + button.dataset.id;
        });
    
    });
});
