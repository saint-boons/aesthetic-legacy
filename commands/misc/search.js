const utils = require('@modules/utils')

const engines = [
    { name: 'DuckDuckGo', link: 'https://duckduckgo.com/?q=' },
    { name: 'Google', link: 'https://google.com/search?q=' },
]

module.exports = {
    name: 'search',
    description: 'Search something on the web',
    options: [
        {
            name: 'query',
            type: 3,
            description: 'Your search query',
            required: true,
        },
        {
            name: 'searchengine',
            type: 3,
            description: 'The search engine to use for the query',
            choices: [
                {
                    name: 'DuckDuckGo',
                    type: 3,
                    value: 'DuckDuckGo'
                },
                {
                    name: 'Google',
                    type: 3,
                    value: 'Google'
                },
            ],
            required: false
        }
    ],
    async execute(interaction, client) {
        const query = interaction.options.getString('query')
        const engine = interaction.options.getString('searchengine') ? interaction.options.getString('searchengine') : 'DuckDuckGo'
        let url = engines.filter(x => x.name === engine)[0].link + query
        return await interaction.editReply({
            embeds: [utils.embed({
                preset: 'default',
                title: `${engine} Search`,
                fields: [
                    { name: `Query`, value: `\`\`\`${query}\`\`\``, inline: false },
                    { name: `Open in browser`, value: `[**HERE**](${url})`, inline: false },
                ]
            })]
        })
    }
}