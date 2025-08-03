//Diz se o usuário passado pode acessar a página ou não
//Para poder acessar a página, o usuário precisa ser o dono da página ou admin

function canAcessPage(channelThatWantsToAcess, pageOwner) {

    if (channelThatWantsToAcess.id == pageOwner.id || channelThatWantsToAcess.admin) {
        return true
    }
    return false

}

module.exports = canAcessPage