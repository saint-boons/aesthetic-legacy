const utils = require('@modules/utils')

module.exports = {
	name: 'avatar',
	description: 'Get your or someone else\'s avatar',
    options: [{
		name: 'target',
		type: 6,
		description: 'User to get the avatar of',
		required: false,
	}],
	async execute(interaction, client) {
        if (interaction.options.getUser('target')) {
            const target = interaction.options.getUser('target')
            return await interaction.editReply({ embeds: [utils.embed({
                preset: 'default',
                title: `${target.username}'s Avatar`,
                fields: [
                    { name: 'URL', value: `${target.displayAvatarURL(true)}`, inline: false }
                ],
                image: target.displayAvatarURL(true)
            })]})
        } else {
            return await interaction.editReply({ embeds: [utils.embed({
                preset: 'default',
                title: `Your Avatar`,
                fields: [
                    { name: 'URL', value: `${interaction.user.displayAvatarURL(true)}`, inline: false }
                ],
                image: interaction.user.displayAvatarURL(true)
            })]})
        }
	},
}