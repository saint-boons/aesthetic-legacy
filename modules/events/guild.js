const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const embed = require('@modules/embed.js')
const tools = require('@modules/tools.js')
const db = require('@modules/db.js')

module.exports = (client) => {
    client.on('guildBanAdd', (guild, user) => {
        //
    })

    client.on('guildBanRemove', (guild, user) => {
        //
    })

    client.on('guildMemberAdd', (member) => {
        //
    })

    client.on('guildMemberRemove', (member) => {
        //
    })

    client.on('guildUnavailable', (guild) => {
        //
    })
}