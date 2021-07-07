const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const tools = require('@modules/tools.js')
const embed = require('@modules/embed.js')
const moderation = require('@modules/moderation.js')

module.exports = {
    commands: ['warn', 'warns'],
    expectedArgs: 'user* reason',
    minArgs: 1,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Warn a member",
    callback: (client, message, arguments) => {
        if (arguments[0] !== 'remove') {
            let target = message.mentions.members.first() ? message.mentions.members.first() : tools.getUser(arguments[0])
            if (!target) return message.channel.send(embed('error', `Warn`, `Cannot warn \`${arguments[0]}\`. Invalid target user`))

            let reason = arguments.slice(1).join(" ")
            if (!reason) reason = 'Unspecifed'

            if (target.id === message.author.id) return message.channel.send(embed('error', `Warn`, `You cannot warn yourself!`))

            let response = moderation.add('warn', message.guild.id, target.id, message.author.id, reason)
            if (response.sucess === false) return message.channel.send(embed('error', 'Warn', `${response.reason}`))
            moderation.check(message.guild.id, target.id)
            message.channel.send(embed('default', `User Warned`, `User ${target} was warned!`).addFields(
                { name: 'Author', value: `${message.author}`, inline: true },
                { name: 'ID', value: `\`\`\`${response.id}\`\`\``, inline: true },
                { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
            ))
        } else {
            let target = message.mentions.members.first() ? message.mentions.members.first() : tools.getUser(arguments[1])
            if (!target) return message.channel.send(embed('error', `Remove Warn`, `Cannot remove warn from \`${arguments[1]}\`. Invalid target user`))

            let reason = arguments.slice(2).join(" ")
            if (!reason) reason = 'Unspecifed'

            if (target.id === message.author.id) return message.channel.send(embed('error', `Remove Warn`, `You cannot remove a warn from yourself!`))

            let response = moderation.remove('warn', message.guild.id, target.id, message.author.id, reason)
            if (response.sucess === false) return message.channel.send(embed('error', 'Remove Warn', `${response.reason}`))
            moderation.check(message.guild.id, target.id)
            message.channel.send(embed('default', `User Warn Removed`, `User ${target} had a warn removed!`).addFields(
                { name: 'Author', value: `${message.author}`, inline: true },
                { name: 'ID', value: `\`\`\`${response.id}\`\`\``, inline: true },
                { name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: false },
            ))
        }
    }
}