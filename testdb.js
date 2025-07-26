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
            name: "Nome",
            password: "1234",
            color: "#349208",
            videos: []

        }
        
    ],

    tags: [
        new Tag("vlog", "#3776db"),
        new Tag("gameplay", "#e0332d"),
        new Tag("experimental", "#ffffff"),
        new Tag("conversa", "#f28b88"),
        new Tag("culinária", "#f3df2fff"),
        new Tag("ciência", "#6cff4fff"),
        new Tag("programação", "#2fa5f3ff"),
        new Tag("tutorial", "#f7cf62f8"),
        new Tag("comédia", "#f8e003ff"),
        new Tag("maquiagem", "#8a59e4ff"),
        new Tag("react", "#39b835ff"),
    ]
}

module.exports = db