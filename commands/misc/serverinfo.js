const utils = require('@modules/utils')

module.exports = {
    name: 'serverinfo',
    description: 'Get information on the current server',
    async execute(interaction, client) {
        return await interaction.editReply({
            embeds: [utils.embed({
                preset: 'default',
                title: `${interaction.guild.name} Server Information`,
                description: `Here are some details about the current server.`,
                fields: [
                    { name: 'Name', value: `\`\`\`${interaction.guild.name}\`\`\``, inline: true},
                    { name: 'Total Members', value: `\`\`\`${interaction.guild.memberCount}\`\`\``, inline: true },
                    { name: 'Server Creation Date', value: `\`\`\`${utils.simplifyDate(interaction.guild.createdAt)}\`\`\``, inline: false },
                ],
                thumbnail: interaction.guild.iconURL(true)
            })]
        })
    },
}