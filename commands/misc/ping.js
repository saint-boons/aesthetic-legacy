const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['ping', 'latency'],
	description: "Check the bot's and api latency",
    callback: (client, message) => {
		// Calculate bot latency
        const ping = new Date().getTime() - message.createdTimestamp;
	    message.channel.send(embed('default', `Ping Results`, `Here are the detailed ping results!`).addFields(
			{ name: 'Bot Latency', value: `\`\`\`${ping} ms\`\`\``, inline: true },
			{ name: 'API Latency', value: `\`\`\`${client.ws.ping} ms\`\`\``, inline: true },
		));
    },
}