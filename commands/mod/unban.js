const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const tools = require('@modules/tools.js')
const embed = require('@modules/embed.js')
const moderation = require('@modules/moderation.js')

module.exports = {
    commands: ['unban', 'unpermban', 'unperm-ban', 'unpermaban', 'unperma-ban', 'untempban', 'untempoban', 'untemp-ban', 'untempo-ban', 'untemporaryban', 'untemporary-ban'],
    expectedArgs: 'userID* reason',
    minArgs: 1,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Unban a member",
    callback: (client, message, arguments) => {
        let target = arguments[0]
        if (target.length !== 16) return message.channel.send(embed('error', 'Unban', `Cannot unban \`${arguments[0]}\`. Invalid target userID`))

        let reason = arguments.slice(1).join(" ")
        if (!reason) reason = 'Unspecifed'

        if (target === message.author.id) return message.channel.send(embed('error', `Unban`, `You cannot unban yourself!`))

        let response = moderation.remove('ban', message.guild.id, target, message.author.id, reason)
        if (response.sucess === false && response.reason === `1`) return message.channel.send(embed('error', 'Unban', `Cannot unban ${tools.getUser(target)}, they are not banned`))
        if (response.sucess === false) return message.channel.send(embed('error', 'Mute', `${response.reason}`))
        moderation.check(message.guild.id, target.id)
        message.channel.send(embed('default', `User Unbanned`, `User ${target} was unbanned!`).addFields(
            { name: 'Author', value: `${message.author}`, inline: true },
            { name: 'ID', value: `\`\`\`${response.id}\`\`\``, inline: true },
            { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
        ))
    }
}