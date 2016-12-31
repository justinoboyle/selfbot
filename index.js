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
    fs.readdir(logFolder, files =>
        res.send(
            files ? files : ""
        )
    )
)

const bCorrector = {};
const nogtext = {};
const logger = (() => { try { return require('./logger') } catch (e) { }; return {}; })();
const bChar = "🅱️";

client.on('message', msg => {
    if (logger[msg.channel.id])
        fs.appendFile(path.join(logFolder, `${msg.channel.id}.log`), `${Date.now()} ${msg.author.id}: ${msg.content}\n`);

    if (msg.author.id !== config.userid)
        return;

    if (msg.content.toLowerCase() == "/b on") {
        bCorrector[msg.channel.id] = true;
        return msg.delete();
    }

    if (msg.content.toLowerCase() == "/b off") {
        bCorrector[msg.channel.id] = false;
        delete bCorrector[msg.channel.id];
        msg.delete();
        return;
    }

    if (msg.content.toLowerCase() == "/log on") {
        logger[msg.channel.id] = true;
        saveLogger();
        return msg.delete();
    }

    if (msg.content.toLowerCase() == "/log off") {
        logger[msg.channel.id] = false;
        delete logger[msg.channel.id];
        msg.delete();
        saveLogger();
        return;
    }

    if (msg.content.toLowerCase() == "/g off") {
        nogtext[msg.channel.id] = true;
        return msg.delete();
    }

    if (msg.content.toLowerCase() == "/g on") {
        nogtext[msg.channel.id] = false;
        delete nogtext[msg.channel.id];
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

    if (msg.content.startsWith('/sh ')) {
        try {
            let str = msg.content.substring('/sh '.length);
            msg.delete();
            var exec = require('child_process').exec;
            exec(str, function callback(error, stdout, stderr) {
                msg.channel.sendMessage(stdout)
            });
        } catch (e) {
            msg.edit(e.toString());
        }
    }

    if (bCorrector[msg.channel.id]) {
        setTimeout(() => {
            let words = msg.content.split(' ');
            let indx = Math.floor(Math.random() * words.length);
            words[indx] = bChar + words[indx].substring(1);
            msg.edit(words.join(' '));
        }, 100);
    }

    if (!nogtext[msg.channel.id]) {
        setTimeout(() => {
            if (msg.content.startsWith(">"))
                msg.edit("```css\n" + msg.content + "\n```")
        }, 100);
    }

});

function saveLogger() {
    fs.writeFile('./logger.json', JSON.stringify(logger, null, 4))
}

client.login(config.token);

app.listen(config.port);