const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['search', 'lookup', 'duckduckgo'],
    expectedArgs: 'query*',
    minArgs: 1,
    description: "Search something with DuckDuckGo",
    callback: (client, message, arguments) => {
        const url = 'https://duckduckgo.com/?q=' + arguments.slice(0).join("+")
        message.channel.send(embed('default', `DuckDuckGo Search`, `Here is the link to your query.`).addFields(
            { name: `Query`, value: `\`\`\`${arguments.slice(0).join(" ")}\`\`\``, inline: false },
            { name: `Open in browser`, value: `[**HERE**](${url})`, inline: false },
        ));
    },
}