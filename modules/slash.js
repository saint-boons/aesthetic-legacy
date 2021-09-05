const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = async (client) => {
    const guilds = await client.guilds.fetch()
    const commands = client.commands.map(({ execute, ...data }) => data)

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    try {
        console.log(`SLASH [/] COMMANDS: DEPLOYING TO ${guilds.size} SERVERS`)
        for (guild of guilds) {

            await rest.put(
                Routes.applicationGuildCommands(client.user.id, guild[1].id),
                { body: commands },
            )

        }
        console.log('SLASH [/] COMMANDS: DEPLOYMENT SUCESSFULL')
    } catch (error) {
        console.error(error)
    }
}