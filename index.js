const Discord = require('discord.js');

const client = new Discord.Client();
const config = require('./config');

const bCorrector = {};
const nogtext = {};

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

    if (msg.content.toLowerCase() == "/g off") {
        nogtext[msg.channel] = true;
        return msg.delete();
    }

    if (msg.content.toLowerCase() == "/g on") {
        nogtext[msg.channel] = false;
        delete nogtext[msg.channel];
        msg.delete();
        return;
    }

    if (bCorrector[msg.channel]) {
        setTimeout(() => {
            let words = msg.content.split(' ');
            let indx = Math.floor(Math.random() * words.length);
            words[indx] = bChar + words[indx].substring(1);
            msg.edit(words.join(' '));
        }, 100);
    }

    if (!nogtext[msg.channel]) {
        setTimeout(() => {
            if (msg.content.startsWith(">")) {
                msg.edit("```css\n" + msg.content + "\n```")
            }
        }, 100);
    }


});

client.login(config.token);