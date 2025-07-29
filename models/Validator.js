class Validator {

    constructor() {

        this.hexColorRegex = /^#[0-9A-F]{6}$/i
        this.nonAlphanumericRegex = /[^\w]/
        this.videoTitleRegex = /[^\w|^\s|^[\-!@#$%&*()=\[\]\{\},.;:/?'"£¢¹²³§`^~<>°\|]]/
        this.videoDescriptionRegex = this.videoTitleRegex
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

    isValidVideoTitle(string) {
        
        /* 
        
            Encontra qualquer caráctere que NÃO seja:

            Alfanúmerico
            Um dos seguintes símbolos: - ! @ # $ % & * () = [] {} , . ; : / ? ' "
        
        */
        const match = string.match(this.videoTitleRegex)
        if (match) {
            return [false, "Você não pode usar o seguinte caráctere no seu título:" + "'" + match + "'"]
        }

        if (string.length < 1) {
            return [false, "O seu título é muito curto."]
        } else if (string.length > 48) {
            return [false, "O seu título é muito grande. O máximo é 48 caracteres. O seu texto tem " + string.length + " caracteres."]
        }

        return [true]
    }

    isValidVideoDescription(string) {
        const match = string.match(this.videoTitleRegex)

        if (match) {
            return [false, "Você não pode usar o seguinte caráctere na sua descrição:" + "'" + match + "'"]
        }

        if (string.length > 1024) {
            return [false, "A sua descrição é muito grande. O máximo é 1024 caracteres. O seu texto tem " + string.length + " caracteres."]
        }
        
        return [true]
    }

}

module.exports = Validator