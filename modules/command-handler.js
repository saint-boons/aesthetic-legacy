const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const tools = require('@modules/tools.js')

// Valid Discord permission nodes function
const validatePermissions = (permissions) => {
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS' ,
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBER',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS'
    ]
    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unknown permission node: "${permission}"`)
        }
    }
}

module.exports = (client, commandOptions) => {
    let {
        // Defaults - command options
        commands,
        expectedArgs = '',
        minArgs = 0,
        maxArgs = null,
        requiredRoles = [],
        permissions = [],
        serverOnly = false,
        nsfw = false,
        callback,
    } = commandOptions

    // Convert string to array - commands
    if (typeof commands === 'string') {
        commands = [commands]
    }

    console.log(tools.consolePrefix('info'), `Command registered:`, tools.consoleHighlight('', `${commands[0]}`))

    // Convert strong to array - permissions
    if (permissions.length) {
        if (typeof permissions === 'string') {
            permissions = [permissions]
        }
        // Validate permissions array
        validatePermissions(permissions)
    }

    // Listen for messages
    client.on('message', message => {
        const { member, content, guild } = message

        for (const alias of commands) {
            if (content.toLowerCase().startsWith(`${config.Prefix}${alias.toLowerCase()}`)) {
                // Server (guild) only check
                if (commandOptions.serverOnly && message.channel.type === 'dm') {
                    message.channel.send(embed('error', `Incorrect Channel Type`, `This command can only be run in a server text channel`))
                    return
                }

                // NSFW check
                if (commandOptions.nsfw && message.channel.nsfw === false) {
                    message.channel.send(embed('error', `Incorrect Channel Type`, `This command can only be run in a NSFW text channel`))
                    return
                }
                
                // Perms check - permission
                for (const permission of permissions) {
                    if (!member.hasPermission(permission)) {
                        message.channel.send(embed('error', `Insufficient Permission`, `You must have \`${permission}\` permission node(s) to use this command.`))
                        return
                    }
                }

                // Perms check - roles
                for (const requiredRole of requiredRoles) {
                        const role = guild.roles.cache.find(role => role.name === requiredRole)
                        
                        if (!role || !member.roles.cache.has(role.id)) {
                            message.channel.send(embed('error', `Insufficient Permission`, `You must have \`${requiredRole}\` role(s) to use this command.`))
                            return
                        }
                }

                // Process arguments
                const arguments = content.split(/[ ]+/)
                arguments.shift()

                // Agument length check
                if (arguments.length < minArgs || (
                    maxArgs !== null && arguments.length > maxArgs
                )) {
                    message.channel.send(embed('error', `Incorrect Syntax`, `Incorrect syntax. Use: \`\`\`${config.Prefix}${alias} ${expectedArgs}\`\`\`\nNeed some help? Do: \`${config.Prefix}help\``))
                    return
                }

                // Handle command
                callback(client, message, arguments, arguments.join(' '))
                return
            }
        }
    })
}