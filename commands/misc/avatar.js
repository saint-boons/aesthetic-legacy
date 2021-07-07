const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['avatar', 'icon', 'pfp'],
    expectedArgs: 'user',
    maxArgs: 1,
    description: "Get your own or someone else's discord avatar",
    callback: (client, message) => {
            if (!message.mentions.users.size) {
                message.channel.send(embed('default', `Your Avatar`, ``).addField('URL', `${message.author.displayAvatarURL({ format: "png", dynamic: true })}`, false).setImage(message.author.displayAvatarURL({ format: "png", dynamic: true })))
            }
            const otherAvatar = message.mentions.users.map(user => {
                message.channel.send(embed('default', `${user.username}'s Avatar`, ``).addField('URL', `${user.displayAvatarURL({ format: "png", dynamic: true })}`, false).setImage(user.displayAvatarURL({ format: "png", dynamic: true })))
            });
    },
}