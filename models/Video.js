class Video {

    constructor(title, description, channel) {
        this.id = 0
        this.videoFile_id = 0
        this.thumbnail_id = 0 
        this.by = channel.id

        this.title = title
        this.description = description
        this.tags = []
        this.date = Date.now()
        this.views = 0
        this.likes = 0
        this.shares = 0
        this.dislikes = 0

    }
}

module.exports = Video