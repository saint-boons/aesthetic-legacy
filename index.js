require('events').EventEmitter.defaultMaxListeners = 50;
require('module-alias/register')
require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
module.exports.client = client
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const tools = require('@modules/tools.js')
const { version } = require('@root/package.json')
const loadCommands = require('@modules/load-commands')
const loadEvents = require('@modules/events.js');
const moderation = require('@modules/moderation.js')

client.on('ready', async () => {
    console.log(tools.consolePrefix('info'), `BOT USER:`, tools.consoleHighlight('', `${client.user.tag}`))
    console.log(tools.consolePrefix('info'), `TIME:`, tools.consoleHighlight('', `${tools.msToDate(client.readyTimestamp)}`))
    console.log(tools.consolePrefix('info'), `VERSION:`, tools.consoleHighlight('', `${version}`))
    console.log(tools.consolePrefix('info'), `AUTHOR:`, tools.consoleHighlight('', `Aesthetic BOT Team`), tools.consoleHighlight('url', `https://aesthetic-bot.com`))
    console.log(tools.consolePrefix('warn'), `This bot is not for reselling. Read the LICENSE.\n`)
    
    client.user.setPresence({
        status: `dnd`,
        activity: {
            name: `commands`,
            type: `LISTENING`
        }
    });

    loadCommands(client)
    loadEvents(client)
    
    setInterval(action = () => {
        moderation.run()
    }, 500)
})

client.login(process.env.DISCORD_TOKEN);