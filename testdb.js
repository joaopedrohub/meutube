const Tag = require("./models/tag")

var db = {

    videos: [


    ],

    videosFile: [

    ],

    thumbnails: [

       "/defaultThumbnail.png"

    ],

    channels: [

        {
            id: 0,
            name: "Eu",
            password: "123",
            color: "#349208",
            videos: []

        }
        
    ],

    tags: [
        new Tag("vlog", "#3776db"),
        new Tag("gameplay", "#e0332d"),
        new Tag("experimental", "#ffffff"),
        new Tag("conversa", "#f28b88"),
        new Tag("culinária", "#ffffff"),
    ]
}

module.exports = db