class Video {

    constructor(title, description) {
        this.id = 0
        this.videoFile_id = 0
        this.thumbnail_id = 0 
        this.by = 0

        this.title = title
        this.description = description
        this.date = Date.now()
        this.views = 0

    }

    setThumbnail() {

    }
}

module.exports = Video