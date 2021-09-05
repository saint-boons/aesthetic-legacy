require('module-alias/register')
require('dotenv').config()
const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const utils = require('@modules/utils')
const cli = require('@modules/cli')
const commands = require('@modules/commands')
const loop = require('@modules/loop')

client.once('ready', () => {
    console.log(utils.prefix('info'), 'BOT READY')
    commands(client)
    cli(client)
    loop(client)
});

client.login(process.env.TOKEN)