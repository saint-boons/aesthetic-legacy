const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const embed = require('@modules/embed.js')
const tools = require('@modules/tools.js')

module.exports = (client) => {
    client.on('inviteCreate', (invite) => {
        if (!config.Logs.Enabled.inviteCreate) return
        const logChannel = invite.guild.channels.cache.find(channel => channel.name.toLowerCase() === `${config.Logs.Channel}`)
        if (!logChannel) return
        logChannel.send(embed('default', 'Invite: Create', ``).addFields(
            { name: `Invite`, value: `[**OPEN**](${invite})`, inline: true},
            { name: `Code`, value: `\`\`\`${invite.code}\`\`\``, inline: true},
            { name: `Max Uses`, value: `${invite.maxUses}`, inline: true},
            { name: `Inviter`, value: `${invite.inviter}`, inline: false},
            { name: `Expires`, value: `\`\`\`${tools.msToDate(Date.now() + (invite.maxAge * 1000))}\`\`\``, inline: false},
        ))
    })

    client.on('inviteDelete', (invite) => {
        if (!config.Logs.Enabled.inviteDelete) return
        const logChannel = invite.guild.channels.cache.find(channel => channel.name.toLowerCase() === `${config.Logs.Channel}`)
        if (!logChannel) return
        console.log(invite)
        logChannel.send(embed('default', 'Invite: Delete', ``).addFields(
            { name: `Invite`, value: `[**OPEN**](${invite})`, inline: true},
            { name: `Code`, value: `\`\`\`${invite.code}\`\`\``, inline: true},
        ))
    })
}