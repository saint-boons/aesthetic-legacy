const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const tools = require('@modules/tools.js')
const embed = require('@modules/embed.js')
const moderation = require('@modules/moderation.js')

module.exports = {
    commands: ['mute', 'permmute', 'perm-mute', 'permamute', 'perma-mute'],
    expectedArgs: 'user* reason',
    minArgs: 1,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Mute a member",
    callback: (client, message, arguments) => {
        let target = message.mentions.members.first() ? message.mentions.members.first() : tools.getUser(arguments[0])
        if (!target) return message.channel.send(embed('error', `Ban`, `Cannot mute \`${arguments[0]}\`. Invalid target user`))

        let reason = arguments.slice(1).join(" ")
        if (!reason) reason = 'Unspecifed'

        if (target.id === message.author.id) return message.channel.send(embed('error', `Mute`, `You cannot mute yourself!`))

        let response = moderation.add('mute', message.guild.id, target.id, message.author.id, reason)
        if (response.sucess === false) return message.channel.send(embed('error', 'Mute', `${response.reason}`))
        moderation.check(message.guild.id, target.id)
        message.channel.send(embed('default', `User Muted`, `User ${target} was muted!`).addFields(
            { name: 'Author', value: `${message.author}`, inline: true },
            { name: 'Length', value: `\`\`\`PERMANENT\`\`\``, inline: true },
            { name: 'ID', value: `\`\`\`${response.id}\`\`\``, inline: true },
            { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
        ))
    }
}