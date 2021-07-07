const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const embed = require('@modules/embed.js')
const tools = require('@modules/tools.js')
const db = require('@modules/db.js')

module.exports = (client) => {
    client.on('guildBanAdd', (guild, user) => {
        db.update('moderation', ['count'], [0], `serverID = '${member.guild.id}' AND userID = '${member.user.id}' AND (type = 'warn' OR type = 'tempmute' OR type = 'mute')`)
    })

    client.on('guildBanRemove', (guild, user) => {
        //
    })

    client.on('guildMemberAdd', (member) => {
        //
    })

    client.on('guildMemberRemove', (member) => {
        db.update('moderation', ['count'], [0], `serverID = '${member.guild.id}' AND userID = '${member.user.id}' AND (type = 'warn' OR type = 'tempmute' OR type = 'mute')`)
    })

    client.on('guildUnavailable', (guild) => {
        //
    })
}