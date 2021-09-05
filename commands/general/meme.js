const utils = require('@modules/utils')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const axios = require('axios')

let subreddits = []
for (subreddit of config.meme.validSubreddits) {
    subreddits.push({
        name: subreddit,
        type: 3,
        value: subreddit,
    })
}

const embedNSFW = utils.embed({
    preset: 'error',
    title: `NSFW Post`,
    description: `The post that was retuned by reddit was marked as NSFW and cannot be displayed in a non-NSFW channel`,
})

module.exports = {
    name: 'meme',
    description: 'Fetch memes from reddit',
    options: [
        {
            name: 'subreddit',
            type: 3,
            description: 'Subreddit from which to fetch the meme from',
            choices: subreddits,
            required: false,
        },
    ],
    async execute(interaction, client) {
        const subreddit = interaction.options.getString('subreddit') ? interaction.options.getString('subreddit').toLowerCase() : config.meme.defaultSubreddit
        let permalink
        let url
        let title
        let content
        let created
        let author
        let upvotes
        let comments

        axios.get(`https://www.reddit.com/r/${subreddit}/random/.json`)
            .then(async (data) => {
                if (data.data[0]) {
                    if (data.data[0].data.children[0].data.over_18 === true && !interaction.channel.nsfw) return await interaction.editReply({ embeds: [embedNSFW] })
                    permalink = data.data[0].data.children[0].data.permalink
                    url = `https://reddit.com${permalink}`
                    title = data.data[0].data.children[0].data.title
                    content = data.data[0].data.children[0].data.url
                    created = data.data[0].data.children[0].data.created_utc * 1000
                    author = data.data[0].data.children[0].data.author
                    upvotes = data.data[0].data.children[0].data.score
                    comments = data.data[0].data.children[0].data.num_comments
                    return await interaction.editReply({
                        embeds: [utils.embed({
                            preset: 'default',
                            title: title,
                            description: `Here is a meme from \`r/${subreddit}\`\n[**OPEN**](${url})`,
                            fields: [
                                { name: `Author`, value: `\`\`\`u/${author}\`\`\``, inline: true },
                                { name: `Upvotes`, value: `\`\`\`${upvotes}\`\`\``, inline: true },
                                { name: `Comments`, value: `\`\`\`${comments}\`\`\``, inline: true },
                            ],
                            image: content,
                            timestamp: created,
                        })]
                    })
                } else {
                    if (data.data.data.children[0].data.over_18 === true && !interaction.channel.nsfw) return await interaction.editReply({ embeds: [embedNSFW] })
                    permalink = data.data.data.children[0].data.permalink
                    url = `https://reddit.com${permalink}`
                    title = data.data.data.children[0].data.title
                    content = data.data.data.children[0].data.url
                    created = data.data.data.children[0].data.created_utc * 1000
                    author = data.data.data.children[0].data.author
                    upvotes = data.data.data.children[0].data.score
                    comments = data.data.data.children[0].data.num_comments
                    return await interaction.editReply({
                        embeds: [utils.embed({
                            preset: 'default',
                            title: title,
                            description: `Here is a meme from \`r/${subreddit}\`\n[**OPEN**](${url})`,
                            fields: [
                                { name: `Author`, value: `\`\`\`u/${author}\`\`\``, inline: true },
                                { name: `Upvotes`, value: `\`\`\`${upvotes}\`\`\``, inline: true },
                                { name: `Comments`, value: `\`\`\`${comments}\`\`\``, inline: true },
                            ],
                            image: content,
                            timestamp: created,
                        })]
                    })
                }
            })
            .catch(async (err) => {
                return await interaction.editReply({
                    embeds: [utils.embed({
                        preset: 'error',
                        title: `Unknown`,
                        description: `An unexpected error occcured, contact an administrator.`,
                    })]
                })
                console.log(utils.prefix('error'), err)
            })
    }
}