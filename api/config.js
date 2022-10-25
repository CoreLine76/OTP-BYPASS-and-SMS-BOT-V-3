module.exports = {
    setupdone: 'true',

    /**
     * Informations à propos du compte Twilio
     */
    accountSid: '',
    authToken: '',
	callerid: '+',
    /**
     * Informations à propos de l'API
     */
    apipassword: '',
    serverurl: '',

    /**
     * Informations à propos du webhook discord
     */
    discordwebhook: '',

    /**
     * Port sur lequel tourne le serveur express
     */
    port: process.env.PORT || 80,

    /**
     * Chemins de stockage des fichiers audios
     */




    /**
     * Contenu des sms selon les services demandés
     */
    paypalsms: 'pp test 123'
};
