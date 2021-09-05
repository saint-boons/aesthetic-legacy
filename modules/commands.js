const utils = require('@modules/utils')
const { Collection } = require('discord.js')

module.exports = async (client) => {
    client.commands = new Collection()
    let files = utils.getCommandFiles('')
    for (file of files) {
        let command = require(`../commands/${file}`)
        client.commands.set(command.name, command)
    }
    const folders = utils.getCommandCategories()
    for (folder of folders) {
        let content = utils.getCommandFiles(folder)
        for (file of content) {
            let command = require(`../commands/${folder}/${file}`)
            client.commands.set(command.name, command)
        }
    }

    interactions = new Collection()
    let interactionFiles = utils.getInteractionFiles('', '')
    for (file of interactionFiles) {
        let interaction = require(`./interactions/${file}`)
        interactions.set(interaction.name, interaction)
    }
    const interactionFolders = utils.getInteractionCategories()
    for (folder of interactionFolders) {
        let interactionContent = utils.getInteractionFiles(folder, '')
        for (file of interactionContent) {
            let interaction = require(`./interactions/${folder}/${file}`)
            interactions.set(interaction.name, interaction)
        }
        let interactionSubfolders = utils.getInteractionSubcategories(folder)
        for (subfolder of interactionSubfolders) {

            let interactionSubfolderContent = utils.getInteractionFiles(folder, subfolder)
            for (file of interactionSubfolderContent) {
                let interaction = require(`./interactions/${folder}/${subfolder}/${file}`)
                interactions.set(interaction.name, interaction)
            }
        }
    }

    client.on('interactionCreate', async interaction => {
        console.log(interaction)
        switch (interaction.type) {
            case 'APPLICATION_COMMAND':
                if (!client.commands.has(interaction.commandName)) return
                await interaction.deferReply()
                try {
                    await client.commands.get(interaction.commandName).execute(interaction, client);
                } catch (err) {
                    console.error(err);
                    await interaction.reply({ embeds: [utils.embed({
                        preset: 'error',
                        title: 'Unknown Error',
                        description: `There was an error while processing this interaction.`,
                    })], ephemeral: true });
                }
                return
            case 'MESSAGE_COMPONENT':
                if (!interactions.has(interaction.customId)) return
                if (interaction.user.id !== interaction.message.interaction.user.id) return await interaction.reply({ embeds: [utils.embed({
                    preset: 'error',
                    title: 'Wrong User',
                    description: `You cannot interact with this element. It is not meant for you.`,
                })], ephemeral: true });
                
                try {
                    await interactions.get(interaction.customId).execute(interaction, client);
                } catch (err) {
                    console.error(err);
                    await interaction.reply({ embeds: [utils.embed({
                        preset: 'error',
                        title: 'Unknown Error',
                        description: `There was an error while processing this interaction.`,
                    })], ephemeral: true });
                }
                return
            default:
                return
        }

    })
}