const utils = require('@modules/utils')
const { version } = require('@root/package.json')

module.exports = {
	name: 'botinfo',
	description: 'Get information on the bot user',
	async execute(interaction, client) {
		return await interaction.editReply({ embeds: [utils.embed({
			preset: 'default',
			title: `Bot Information`,
			description: `Here are some details about the bot.`,
			fields: [
				{ name: 'Name', value: `${client.user}`, inline: false },
            	{ name: 'Uptime', value: `\`\`\`${utils.timeSince((Date.now() - client.uptime))}\`\`\``, inline: false },
            	{ name: 'Version', value: `\`\`\`v${version}\`\`\``, inline: false },
            	{ name: 'Links', value: `*Aesthetic. ORG.*\n[Project Website](https://aesthetic-bot.com)\n[GitHub Organisation](https://github.com/aesthetic-org)\n[Organisation Website](https://aesthetic-org.com)`, inline: false },
			],
			image: 'https://i.imgur.com/rv6AzuR.png',
			thumbnail: client.user.avatarURL(true)
		})] })
	},
}