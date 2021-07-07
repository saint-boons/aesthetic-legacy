const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['embed'],
    expectedArgs: 'colour* title* text*',
    minArgs: 3,
    requiredRoles: ['Admin'],
    description: "Send a fancy embed message with the bot",
    callback: (client, message, arguments) => {
        var color = arguments[0].toLowerCase()
        const title = arguments[1]
        const content = arguments.slice(2).join(" ")
        if (color == 'default') {
            message.channel.send(embed('default', `${title}`, `${content}`))
        } else {
            if (color.length == 6) {
                color = '#' + `${color}`
            }
            var isHex = /^#[0-9A-F]{6}$/i.test(color);
            if (isHex == true) {
                message.delete()
                message.channel.send(embed('default', `${title}`, `${content}`).setColor(`${color}`))
            } else {
                message.channel.send(embed('error', `Incorrect Usage`, `Expecting a valid hex colour code or \`default\`.`))
            }
        }
    },
};