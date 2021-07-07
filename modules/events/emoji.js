const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const embed = require('@modules/embed.js')
const tools = require('@modules/tools.js')

module.exports = (client) => {
    client.on('emojiCreate', (emoji) => {
        if (!config.Logs.Enabled.emojiCreate) return
        const logChannel = emoji.guild.channels.cache.find(channel => channel.name.toLowerCase() === `${config.Logs.Channel}`)
        if (!logChannel) return
        logChannel.send(embed('default', 'Emoji: Create', ``).addFields(
            { name: `Emoji`, value: `${emoji}`, inline: true},
            { name: `Name`, value: `\`${emoji.name}\``, inline: true},
            { name: `Animated`, value: `\`\`\`${emoji.animated}\`\`\``, inline: true},
            { name: `ID`, value: `\`\`\`${emoji.id}\`\`\``, inline: false},
        ))
    })

    client.on('emojiDelete', (emoji) => {
        if (!config.Logs.Enabled.emojiDelete) return
        const logChannel = emoji.guild.channels.cache.find(channel => channel.name.toLowerCase() === `${config.Logs.Channel}`)
        if (!logChannel) return
        logChannel.send(embed('default', 'Emoji: Delete', ``).addFields(
            { name: `Emoji`, value: `\`${emoji.name}\``, inline: true},
            { name: `Animated`, value: `\`\`\`${emoji.animated}\`\`\``, inline: true},
            { name: `ID`, value: `\`\`\`${emoji.id}\`\`\``, inline: false},
        ))
    })

    client.on('emojiUpdate', (oldEmoji, newEmoji) => {
        if (!config.Logs.Enabled.emojiUpdate) return
        const logChannel = newEmoji.guild.channels.cache.find(channel => channel.name.toLowerCase() === `${config.Logs.Channel}`)
        if (!logChannel) return
        logChannel.send(embed('default', 'Emoji: Update', ``).addFields(
            { name: `Emoji`, value: `${newEmoji}`, inline: true},
            { name: `Name`, value: `\`${oldEmoji.name}\` → \`${newEmoji.name}\``, inline: true},
            { name: `ID`, value: `\`\`\`${newEmoji.id}\`\`\``, inline: false},
        ))
    })
}