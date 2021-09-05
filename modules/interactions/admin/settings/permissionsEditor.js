const utils = require('@modules/utils')
const db = require('@modules/db')

module.exports = {
    name: 'permissionsEditor',
    async execute(interaction, client) {
        if (interaction.values[0].startsWith('menu-')) {
            const category = interaction.values[0].slice(5)
            let categories = utils.getCommandCategories()
            if (!categories.includes(category)) return
            let commands = utils.getCommandFiles(category)
            let list = []
            let options = []
            for (command of commands) {
                let content = utils.getCommand(category, command)
                list.push(`\`${content.name}\` • *${content.description}*`)
                options.push({
                    label: content.name,
                    description: content.description,
                    value: content.name
                })
            }
            return await interaction.update({
                embeds: [utils.embed({
                    preset: 'default',
                    title: `\`${utils.title(category)}\` Server Permission Settings`,
                    description: `\`${commands.length}\` commands\n\n${list.join('\n')}`,
                })], components: [utils.row([utils.menu({
                    id: 'permissionsEditor',
                    placeholder: 'Select a command to edit',
                    options: options
                })])]
            })
        } else {
            const command = await client.commands.get(interaction.values[0])
            let table = db.select({
                columns: `*`,
                table: `permissions`,
                conditions: `guildID = '${interaction.guildId}' AND command = '${command.name}'`,
                scope: `all`,
            })
            
            console.log(table)
            return await interaction.update({
                embeds: [utils.embed({
                    preset: 'default',
                    title: `\`${command.name}\` Command Server Permission Settings`,
                    description: `Select the roles that can run this command using the menu`,
                    fields: [
                        { name: 'Permited Roles', value: 'wip', inline: true}
                    ]
                })], components: [utils.row([utils.menu({
                    id: 'permissionsEditor',
                    placeholder: 'Select a command to edit',
                    options: [
                        {
                            label: 'wip',
                            description: 'wip',
                            value: 'wip'
                        }
                    ]
                })])]
            })
        }
    }
}