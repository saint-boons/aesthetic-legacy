const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const embed = require('@modules/embed.js')
const tools = require('@modules/tools.js')

module.exports = (client) => {
    client.on('roleCreate', (role) => {
        if (!config.Logs.Enabled.roleCreate) return
        const logChannel = role.guild.channels.cache.find(channel => channel.name.toLowerCase() === `${config.Logs.Channel}`)
        if (!logChannel) return
        logChannel.send(embed('default', 'Role: Create', ``).addFields(
            { name: `Role`, value: `${role}`, inline: true},
            { name: `ID`, value: `\`\`\`${role.id}\`\`\``, inline: false},
        ))
    })

    client.on('roleDelete', (role) => {
        if (!config.Logs.Enabled.roleDelete) return
        const logChannel = role.guild.channels.cache.find(channel => channel.name.toLowerCase() === `${config.Logs.Channel}`)
        if (!logChannel) return
        logChannel.send(embed('default', 'Role: Delete', ``).addFields(
            { name: `Role`, value: `\`${role.name}\``, inline: true},
            { name: `ID`, value: `\`\`\`${role.id}\`\`\``, inline: false},
        ))
    })
}