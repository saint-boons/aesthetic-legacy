const loadYAML = require('@utilities/yaml.js')
const config = loadYAML('config')

module.exports = (client, aliases, callback) => {
    if (typeof aliases === 'string') {
        aliases = [aliases]
    }
    
    client.on('message', message => {
        const { content } = message;

        aliases.forEach(alias => {
            const command = `${config.Prefix}${alias}`

            if (content.startsWith(`${command} `) || content === command) {
                callback(message)
            }
        });
    })
}