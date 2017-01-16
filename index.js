const Discord = require('discord.js');

const client = new Discord.Client();
const config = require('./config');

const spokenFn = require('./spoken');
const embedUtil = require('./embed');

const fs = require('fs');

const path = require('path');
const express = require('express');

const request = require('request');

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
const spoken = {};
const nogtext = {};
const emsg = {};
const logger = (() => { try { return require('./logger') } catch (e) { }; return {}; })();
const bChar = "🅱️";

global.embed = (channel, reply) => {
    const embed = new Discord.RichEmbed();
    if (reply.main)
        embed.setTitle(reply.main);
    if (reply.subtext)
        embed.setDescription(reply.subtext);
    if (reply.fields)
        for (let x of reply.fields)
            embed.addField(x[0], x[1], true)
    if (embed.color)
        embed.setColor(embed.color)
    else
        embed.setColor(0x00AE86)
    channel.sendEmbed(
        embed,
        ``,
        { disableEveryone: true }
    );
}

client.on('message', msg => {
    if(msg.content.length < 1)
        return;
    try {
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

        if (msg.content.toLowerCase() == "/spoken on") {
            spoken[msg.channel.id] = true;
            return msg.delete();
        }

        if (msg.content.toLowerCase() == "/spoken off") {
            spoken[msg.channel.id] = false;
            delete spoken[msg.channel.id];
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

        if (msg.content.toLowerCase() == "/em on") {
            emsg[msg.channel.id] = true;
            return msg.delete();
        }

        if (msg.content.toLowerCase() == "/em off") {
            emsg[msg.channel.id] = false;
            delete emsg[msg.channel.id];
            return msg.delete();
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
                    msg.channel.sendMessage('```\n' + escape(stdout) + '\n```');
                });
            } catch (e) {
                msg.edit(e.toString());
            }
        }

        if (emsg[msg.channel.id]) {
            let text = msg.content
            let ch = msg.channel;
            msg.delete();
            setTimeout(() => {
                embed(ch, {subtext: text});
            }, 50);
            return;
        }

        if (msg.content.startsWith('/emj ')) {
            try {
                let str = msg.content.substring('/emj '.length);
                if (!str.startsWith("{"))
                    str = "{" + str;
                if (!str.endsWith("}"))
                    str = str + "}";
                msg.delete();
                str = JSON.parse(str);
                embed(msg.channel, str);
            } catch (e) {
                msg.edit(e.toString());
            }
            return;
        }

        if (msg.content.startsWith('/emu ')) {
            try {
                let url = msg.content.substring('/emu '.length);
                request(url, (error, response, body) => {
                    console.log(embedUtil(body))
                    embed(msg.channel, {
                        main: ' ', subtext: ' ', fields: embedUtil(body)
                    })
                }

                );
                msg.delete();
            } catch (e) {
                msg.edit(e.toString());
            }
            return;
        }



        if (bCorrector[msg.channel.id]) {
            setTimeout(() => {
                let words = msg.content.split(' ');
                let indx = Math.floor(Math.random() * words.length);
                words[indx] = bChar + words[indx].substring(1);
                msg.edit(words.join(' '));
            }, 100);
        }

        if (spoken[msg.channel.id]) {
            setTimeout(() => {
                msg.edit(spokenFn(msg.content));
            }, 100);
        }

        if (!nogtext[msg.channel.id]) {
            setTimeout(() => {
                if (msg.content.startsWith(">"))
                    msg.edit("```css\n" + msg.content + "\n```")
            }, 100);
        }
    } catch (e) { }
});

function saveLogger() {
    fs.writeFile('./logger.json', JSON.stringify(logger, null, 4))
}

function escape(s) {
    while (s.includes('\\'))
        s = s.replace('\\', '\\\\');
    while (s.includes('`'))
        s = s.replace('`', '\\`');
    return s;

}

client.login(config.token);

app.listen(config.port);