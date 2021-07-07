const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const embed = require('@modules/embed.js')
const tools = require('@modules/tools.js')

module.exports = (client) => {
    client.on('channelCreate', (channel) => {
        if (!config.Logs.Enabled.channelCreate) return
        const logChannel = channel.guild.channels.cache.find(channel => channel.name.toLowerCase() === `${config.Logs.Channel}`)
        if (!logChannel) return
        logChannel.send(embed('default', 'Channel: Create', ``).addFields(
            { name: `Channel`, value: `${channel}`, inline: true},
            { name: `Type`, value: `\`\`\`${channel.type}\`\`\``, inline: true},
            { name: `ID`, value: `\`\`\`${channel.id}\`\`\``, inline: false},
        ))
    })

    client.on('channelDelete', (channel) => {
        if (!config.Logs.Enabled.channelDelete) return
        const logChannel = channel.guild.channels.cache.find(channel => channel.name.toLowerCase() === `${config.Logs.Channel}`)
        if (!logChannel) return
        logChannel.send(embed('default', 'Channel: Delete', ``).addFields(
            { name: `Channel`, value: `\`${channel.name}\``, inline: true},
            { name: `Type`, value: `\`\`\`${channel.type}\`\`\``, inline: true},
            { name: `ID`, value: `\`\`\`${channel.id}\`\`\``, inline: false},
        ))
    })

    client.on('channelPinsUpdate', (channel, time) => {
        if (!config.Logs.Enabled.channelPinsUpdate) return
        const logChannel = channel.guild.channels.cache.find(channel => channel.name.toLowerCase() === `${config.Logs.Channel}`)
        if (!logChannel) return
        logChannel.send(embed('default', 'Channel: Pins Update', ``).addFields(
            { name: `Channel`, value: `${channel}`, inline: true},
            { name: `ID`, value: `\`\`\`${channel.id}\`\`\``, inline: false},
        ))
    })
}