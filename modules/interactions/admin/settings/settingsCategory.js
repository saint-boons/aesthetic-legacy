const utils = require('@modules/utils')
const db = require('@modules/db')

module.exports = {
    name: 'settingsCategory',
    async execute(interaction, client) {
        switch (interaction.values[0]) {
            case 'permissions':
                db.create({
                    table: 'permissions',
                    columns: 'guildID TEXT, command TEXT, roleID TEXT'
                })
                let options = []
                let categories = utils.getCommandCategories()
                for (category of categories) {
                    options.push({
                        label: utils.title(category),
                        description: `Edit ${category} commands permissions`,
                        value: `menu-${category}`
                    })
                }
                let fields = []
                for (category of categories) {
                    fields.push({
                        name: utils.title(category),
                        value: `\`${utils.getCommandFiles(category).length}\` commands`,
                        inline: true
                    })
                }

                return await interaction.update({
                    embeds: [utils.embed({
                        preset: 'default',
                        title: 'Server Permission Settings',
                        description: 'Select a category using the select menu below.',
                        fields: fields,
                    })], components: [utils.row([utils.menu({
                        id: 'permissionsEditor',
                        placeholder: 'Select a category',
                        options: options
                    })])]
                })
            case 'moderation':
                return
            case 'welcome':
                return
            case 'reactionr':
                return
            case 'levels':
                return
            case 'economy':
                return
            case 'music':
                return
        }

        let options = []
        let categories = utils.getCommandCategories()
        for (category of categories) {
            options.push({
                label: utils.title(category),
                description: `Edit ${category} commands permissions`,
                value: category
            })
        }

        return await interaction.editReply({
            embeds: [utils.embed({
                preset: 'default',
                title: 'Permission Settings',
                description: 'Select a category using the select menu below.',
            })], components: [utils.row([utils.menu({
                id: 'permissionCategorySelect',
                placeholder: 'Select a category',
                options: options
            })])]
        })
    }
}