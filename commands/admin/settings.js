const utils = require('@modules/utils')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

let categories = [
    {
        name: 'Permissions',
        description: 'Edit permissions per command or per category',
        value: 'permissions',
    },
    {
        name: 'Moderation',
        description: 'Edit moderation settings',
        value: 'moderation'
    },
    {
        name: '[WIP] Welcome',
        description: 'Edit welcome messages and roles',
        value: 'welcome',
    },
    {
        name: '[WIP] Reaction Roles',
        description: 'Edit reaction roles menus',
        value: 'reactionr'
    },
    {
        name: '[WIP] Levels',
        description: 'Edit leveling settings',
        value: 'levels'
    },
    {
        name: '[WIP] Economy',
        description: 'Edit economy settings',
        value: 'economy'
    },
    {
        name: '[WIP] Music',
        description: 'Edit music settings',
        value: 'music'
    },
]

module.exports = {
    name: 'settings',
    description: 'Change server settings',
    async execute(interaction, client) {
        let options = []
        for (category of categories) {
            options.push({
                label: category.name,
                description: category.description,
                value: category.value,
            })
        }
        let fields = []
        for (category of categories) {
            fields.push({
                name: category.name,
                value: category.description,
                inline: true
            })
        }

        return await interaction.editReply({
            embeds: [utils.embed({
                preset: 'default',
                title: 'Server Settings',
                description: 'Select a category using the select menu below.',
                fields: fields,
            })], components: [utils.row([utils.menu({
                id: 'settingsCategory',
                placeholder: 'Select a category',
                options: options
            })])]
        })
    },
}