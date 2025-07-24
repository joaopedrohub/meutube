class Validator {

    constructor() {

        this.hexColorRegex = /^#[0-9A-F]{6}$/i
        this.nonAlphanumericRegex = /[^\w]/

    }

    isStringLengthInRange(string, min, max) {
        if (string.length >= min  && string.length <= max ) {
            return true
        } else {
            return false
        }
    }

    /* 
    
        Remove dois espaços seguidos ou mais caso haja esse padrão na string
        ex: "a     a" -> "a a"
    */
    trimStringBlankSpace(string) {
        const regex = /\s{2,}/g // o g é para que detecte globalmente (caso haja mais de uma ocorrência)

        return string.replace(regex, " ")
    }

    removeStringBlankSpace(string) {
        const regex = /\s/g

        return string.replace(regex, "")
    }

}

module.exports = Validator