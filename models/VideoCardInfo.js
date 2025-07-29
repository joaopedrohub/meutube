const db = require('../testdb')


class VideoCardInfo {
    
    constructor(video, channel) {

        this.videoId = video.id
        this.title = video.title
        this.thumbnail = video.thumbnailPath
        this.channelName = channel.name
        this.channelColor = channel.color
        this.views = video.views
    }
}

module.exports = VideoCardInfo