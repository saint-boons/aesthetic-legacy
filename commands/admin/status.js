const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['status', 'botstatus', 'bot-status'],
    expectedArgs: 'status* type* text*',
    minArgs: 3,
    requiredRoles: ['Admin'],
    description: "Change the bot's status",
    callback: (client, message, arguments) => {
        const status = arguments[0].toLowerCase()
        const type = arguments[1].toUpperCase()
        const value = arguments.slice(2).join(" ")
        var embedType = null
        var embedStatus = null
        // Check if it's valid status
        switch (status) {
            case 'online':
                embedStatus = 'Online'
                break
            case 'idle':
                embedStatus = 'Idle'
                break
            case 'dnd':
                embedStatus = 'Do Not Disturb'
                break
            case 'donotdisturb':
                status = 'dnd'
                embedStatus = 'Do Not Disturb'
                break
            case 'invisible':
                embedStatus = 'Invisible'
                break
            default:
                message.channel.send(embed('error', `Unknown Status`, `The status \`${arguments[0]}\`does not exist!\nPossible options are: \`online\`, \`idle\`, \`dnd\`, \`invisible\`\n*\`dnd\` is Do Not Disturb*`))
                break
        }
        // Check if it's valid type
        switch (type) {
            case 'PLAYING':
                embedType = 'Playing'
                break
            case 'WATCHING':
                embedType = 'Watching'
                break
            case 'LISTENING':
                embedType = 'Listening'
                break
            case 'STREAMING':
                embedType = 'Streaming'
                break
            default:
                message.channel.send(embed('error', `Unknown Type`, `The type \`${arguments[1]}\`does not exist!\nPossible options are: \`playing\`, \`watching\`, \`listening\`, \`streaming\``))
                break
        }
        // Set presence
        client.user.setPresence({
            status: `${status}`,
            activity: {
                name: `${value}`,
                type: `${type}`
            }
        });
        // Send success embed
        message.channel.send(embed('default', `Status Changed`, `The bot's status was changed.`).addFields(
            { name: 'Status', value: `\`\`\`${embedStatus}\`\`\``, inline: false },
            { name: 'Type', value: `\`\`\`${embedType}\`\`\``, inline: false },
            { name: 'Value', value: `\`\`\`${value}\`\`\``, inline: false },
        ))
    },
};