const { version } = require('@root/package.json')

const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
	commands: ['bot-info', 'botinfo'],
    description: "Get some information on the bot",
	callback: (client, message) => {
        if (message.client.uptime < 60000) {
            uptimeFormated = Math.floor(message.client.uptime / 1000) + ' second(s)'
        }
        if (message.client.uptime >= 60000 && message.client.uptime < 3600000) {
            uptimeFormated = Math.floor(message.client.uptime / 60000) + ' minute(s)'
        }
        if (message.client.uptime >= 3600000 && message.client.uptime < 86400000) {
            uptimeFormated = Math.floor(message.client.uptime / 3600000) + ' hour(s)'
        }
        if (message.client.uptime >= 86400000) {
            uptimeFormated = Math.floor(message.client.uptime / 86400000) + ' day(s)'
        }
        message.channel.send(embed('default', `Bot Info`, `Here is some info on the bot.`).addFields(
            { name: 'Name', value: `${message.client.user}`, inline: false },
            { name: 'Uptime', value: `\`\`\`${uptimeFormated}\`\`\``, inline: false },
            { name: 'Version', value: `\`\`\`v${version}\`\`\``, inline: false },
            { name: 'Links', value: `[Project Website](https://aesthetic-bot.com)\n[GitHub Organisation](https://github.com/aesthetic-org)\n[Organisation Website](https://aesthetic-org.com)`, inline: false },
        ))
	},
};