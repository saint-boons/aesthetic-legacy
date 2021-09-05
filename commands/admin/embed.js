const utils = require('@modules/utils')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

const colors = ['DEFAULT', 'WHITE', 'AQUA', 'GREEN', 'BLUE', 'YELLOW', 'PURPLE', 'LUMINOUS_VIVID_PINK', 'FUCHSIA', 'GOLD', 'ORANGE', 'RED', 'GREY', 'NAVY', 'DARK_AQUA', 'DARK_GREEN', 'DARK_BLUE', 'DARK_PURPLE', 'DARK_VIVID_PINK', 'DARK_GOLD', 'DARK_ORANGE', 'DARK_RED', 'DARK_GREY', 'DARKER_GREY', 'LIGHT_GREY', 'DARK_NAVY', 'BLURPLE', 'GREYPLE', 'DARK_BUT_NOT_BLACK', 'NOT_QUITE_BLACK', 'RANDOM']

module.exports = {
    name: 'embed',
    description: 'Send a fancy embeded message',
    options: [
        {
            name: 'title',
            type: 3,
            description: 'Title of the embed',
            required: true,
        },
        {
            name: 'description',
            type: 3,
            description: 'Description of the embed',
            required: true,
        },
        {
            name: 'color',
            type: 3,
            description: 'Color of the embed in hexadecimal (without the #) or Discord color names',
            required: false,
        },
    ],
    async execute(interaction, client) {
        const title = interaction.options.getString('title')
        const description = interaction.options.getString('description')
        let color = interaction.options.getString('color') ? interaction.options.getString('color').toUpperCase() : config.embed.color.default
        if (!(/^[0-9A-F]{6}$/i.test(color)) && !colors.includes(color)) return await interaction.editReply({
            embeds: [utils.embed({
                preset: 'error',
                title: 'Invalid Color Code',
                description: `Expecting a valid hexadecimal colour code or Discord color name. Example: \`5865F2\``,
                fields: [
                    { name: `Discord Color Names`, value: `\`\`\`${colors.join(', ')}\`\`\``, inline: true }
                ]
            })]
        })
        await interaction.channel.send({
            embeds: [utils.embed({
                preset: 'default',
                title: title,
                description: description,
                color: color,
            })]
        })
        await interaction.deleteReply()
        return await interaction.followUp({
            embeds: [utils.embed({
                preset: 'default',
                title: `Embed Sent`,
                description: `The embed you made was sent successfuly.`,
            })], 
            ephemeral: true
        })
    },
}