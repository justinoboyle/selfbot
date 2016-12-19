const Discord = require('discord.js');

const client = new Discord.Client();
const config = require('./config');

const bCorrector = {};

const bChar = "🅱️";

client.on('message', msg => {
    if (msg.author.id !== config.userid)
        return;
    if (msg.content.toLowerCase() == "/b on") {
        bCorrector[msg.channel] = true;
        return msg.delete();
    }

    if (msg.content.toLowerCase() == "/b off") {
        bCorrector[msg.channel] = false;
        delete bCorrector[msg.channel];
        msg.delete();
        return;
    }

    if (bCorrector[msg.channel]) {
        setTimeout(() => {
            let words = msg.content.split(' ');
            let indx = Math.floor(Math.random() * words.length);
            words[indx] = bChar + words[indx].substring(1);
            msg.edit(words.join(' '));
        }, 10);
    }


});

function correctB(str) {

}

client.login(config.token);