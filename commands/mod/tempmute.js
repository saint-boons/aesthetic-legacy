const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const tools = require('@modules/tools.js')
const embed = require('@modules/embed.js')
const moderation = require('@modules/moderation.js')

module.exports = {
    commands: ['tempmute', 'temppermmute', 'tempperm-mute', 'temppermamute', 'tempperma-mute'],
    expectedArgs: 'user* length* reason',
    minArgs: 2,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Mute a member",
    callback: (client, message, arguments) => {
        let target = message.mentions.members.first() ? message.mentions.members.first() : tools.getUser(arguments[0])
        if (!target) return message.channel.send(embed('error', `Ban`, `Cannot mute \`${arguments[0]}\`. Invalid target user`))

        let length = arguments[1]

        let reason = arguments.slice(2).join(" ")
        if (!reason) reason = 'Unspecifed'

        if (target.id === message.author.id) return message.channel.send(embed('error', `Temp Mute`, `You cannot mute yourself!`))

        let response = moderation.add('tempmute', message.guild.id, target.id, message.author.id, reason, length)
        if (response.sucess === false) return message.channel.send(embed('error', 'Mute', `${response.reason}`))
        moderation.check(message.guild.id, target.id)
        message.channel.send(embed('default', `User Muted`, `User ${target} was muted!`).addFields(
            { name: 'Author', value: `${message.author}`, inline: true },
            { name: 'Length', value: `\`\`\`${arguments[1]}\`\`\``, inline: true },
            { name: 'ID', value: `\`\`\`${response.id}\`\`\``, inline: true },
            { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
        ))
    }
}