const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
	commands: ['user-info', 'userinfo'],
    expectedArgs: 'user',
    maxArgs: 1,
    description: "Get some information about a user or yourself",
	callback: (client, message) => {
            if (!message.mentions.users.size) {
                message.channel.send(embed('default', `Your User Info`, `Here is some info on yourself.`).addFields(
                    { name: 'Username', value: `<@${message.author.id}>`, inline: false },
                    { name: 'ID', value: `\`\`\`${message.author.id}\`\`\``, inline: false },
                    { name: 'Account Creation Date', value: `\`\`\`${message.author.createdAt}\`\`\``, inline: false },
                ))
            }
            const otherUserInfo = message.mentions.users.map(user => {
                message.channel.send(embed('default', `${user.username}'s User Info`, `Here is some info on ${user.username}.`).addFields(
                    { name: 'Username', value: `<@${user.id}>`, inline: false },
                    { name: 'ID', value: `\`\`\`${user.id}\`\`\``, inline: false },
                    { name: 'Account Creation Date', value: `\`\`\`${user.createdAt}\`\`\``, inline: false },
                ))
            });
	},
};