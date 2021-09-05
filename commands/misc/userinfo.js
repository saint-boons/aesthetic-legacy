const utils = require('@modules/utils')

module.exports = {
    name: 'userinfo',
    description: 'Get information on you or another user',
    options: [{
		name: 'target',
		type: 6,
		description: 'User to get the avatar of',
		required: false,
	}],
    async execute(interaction, client) {
        if (interaction.options.getUser('target')) {
            const target = interaction.options.getUser('target')
            const targetGuildMember = utils.getGuildMember(client, target.id, interaction.guild.id)
            return await interaction.editReply({ embeds: [utils.embed({
                preset: 'default',
                title: `${target.username}'s User Information`,
                fields: [
                    { name: 'Username', value: `${target}`, inline: true },
                    { name: 'Top Role', value: `${targetGuildMember.roles.highest}`, inline: true },
                    { name: 'ID', value: `\`${target.id}\``, inline: true },
                    { name: 'Account Creation Date', value: `\`\`\`${utils.simplifyDate(target.createdAt)}\`\`\``, inline: false },
                    { name: 'Server Join Date', value: `\`\`\`${utils.simplifyDate(targetGuildMember.joinedAt)}\`\`\``, inline: false },
                ],
                thumbnail: target.displayAvatarURL(true)
            })]})
        } else {
            const targetGuildMember = utils.getGuildMember(client, interaction.user.id, interaction.guild.id)
            return await interaction.editReply({ embeds: [utils.embed({
                preset: 'default',
                title: `Your User Information`,
                fields: [
                    { name: 'Username', value: `${interaction.user}`, inline: true },
                    { name: 'Top Role', value: `${targetGuildMember.roles.highest}`, inline: true },
                    { name: 'ID', value: `\`${interaction.user.id}\``, inline: true },
                    { name: 'Account Creation Date', value: `\`\`\`${utils.simplifyDate(interaction.user.createdAt)}\`\`\``, inline: false },
                    { name: 'Server Join Date', value: `\`\`\`${utils.simplifyDate(targetGuildMember.joinedAt)}\`\`\``, inline: false },
                ],
                thumbnail: interaction.user.displayAvatarURL(true)
            })]})
        }
    },
}