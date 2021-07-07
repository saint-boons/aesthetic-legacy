const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
	commands: ['server-info', 'serverinfo', 'guild-info', 'guildinfo'],
	description: "Get some information about the server",
	serverOnly: true,
	callback: (client, message) => {
		message.channel.send(embed('default', `Server Info`, `Here is some info on this server.`).addFields(
			{ name: 'Name', value: `\`\`\`${message.guild.name}\`\`\``, inline: false },
			{ name: 'Total Members', value: `\`\`\`${message.guild.memberCount}\`\`\``, inline: false },
			{ name: 'Server Creation Date', value: `\`\`\`${message.guild.createdAt}\`\`\``, inline: false },
			{ name: 'Server Region', value: `\`\`\`${message.guild.region}\`\`\``, inline: false },
		))
	},
};