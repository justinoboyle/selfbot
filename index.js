const Discord = require('discord.js');

const client = new Discord.Client();
const config = require('./config');

const fs = require('fs');

const path = require('path');
const express = require('express');
const app = express();

const logFolder = path.join(__dirname, "logs");
try {
    fs.mkdirSync(logFolder);
} catch (e) { }


app.use(express.static(logFolder));

app.get('/', (req, res) =>
    fs.listFiles(logFolder, files =>
        res.send(
            files.map(
                e => `<a href='${e}.log'>${e}.log</a>`).join('<br />')
        )
    )
)

const bCorrector = {};
const nogtext = {};
const logger = (() => { try { return require('./logger') } catch (e) { }; return {}; })();
const bChar = "🅱️";

client.on('message', msg => {
    if (logger[msg.channel])
        fs.appendFile(path.join(logFolder, `${msg.channel}.log`, `${Date.now()} ${msg.author.id}: ${msg.content}`));

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

    if (msg.content.toLowerCase() == "/log on") {
        logger[msg.channel] = true;
        saveLogger();
        return msg.delete();
    }

    if (msg.content.toLowerCase() == "/log off") {
        logger[msg.channel] = false;
        delete logger[msg.channel];
        msg.delete();
        saveLogger();
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

    if (msg.content.startsWith('/eval ')) {
        try {
            eval(msg.content.substring('/eval '.length));
            msg.delete();
        } catch (e) {
            msg.edit(e.toString());
        }
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
            if (msg.content.startsWith(">"))
                msg.edit("```css\n" + msg.content + "\n```")
        }, 100);
    }

});

function saveLogger() {
    fs.writeFile('./logger.json', logger)
}

client.login(config.token);

app.listen(config.port);