const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
	commands: ['clear', 'clean'],
    expectedArgs: 'number*',
    minArgs: 1,
    maxArgs: 1,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Clear a certain number of messages at once",
	callback: (client, message, arguments) => {
		if (arguments == 'all') {
            message.channel.messages.fetch().then(results => {
                message.channel.bulkDelete(results, true)
            })
        } else {
            let nMessages = parseInt(arguments)
            
            if (isNaN(nMessages) || (nMessages < 1 || nMessages > 99)) {
                message.channel.send(embed('error', `Incorrect Usage`, `Expecting a \`number (1-99)\` or \`all\` as an argument.`))
            } else {
                try {
                    message.channel.bulkDelete(nMessages + 1, true)
                    message.channel.send(embed('default', `Messages Cleared`, `**${nMessages}** message(s) cleared!`))
                    .then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    })
                } catch {
                    message.channel.send(embed('error', `Messages Too Old`, `The messages you are trying to delete are older than 14 days and therefore cannot be deleted.`))
                };
            }
        }
	},
};