const utils = require('@modules/utils')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const axios = require('axios')

const embedNSFW = utils.embed({
    preset: 'error',
    title: `NSFW Post`,
    description: `The post that was retuned by reddit was marked as NSFW and cannot be displayed in a non-NSFW channel`,
})

const embedBanned = utils.embed({
    preset: 'error',
    title: `Invalid Subreddit`,
    description: `The subreddit \`${subreddit}\` was banned from showing with the bot by the admistrators.`,
})

module.exports = {
    name: 'reddit',
    description: 'Fetch posts from any subreddits',
    options: [
        {
            name: 'subreddit',
            type: 3,
            description: 'Subreddit from which to fetch the post from',
            required: true,
        },
        {
            name: 'sorting',
            type: 3,
            description: 'How the Reddit API will pick a post',
            choices: [
                {
                    name: 'random',
                    type: 3,
                    value: 'random',
                },
                {
                    name: 'hot',
                    type: 3,
                    value: 'hot',
                },
                {
                    name: 'new',
                    type: 3,
                    value: 'new',
                },
                {
                    name: 'rising',
                    type: 3,
                    value: 'rising',
                },
                {
                    name: 'top',
                    type: 3,
                    value: 'top',
                },
            ],
            required: false,
        },
    ],
    async execute(interaction, client) {
        const subreddit = interaction.options.getString('subreddit')
        const sorting = interaction.options.getString('sorting') ? interaction.options.getString('sorting') : 'random'
        if (config.reddit.bannedSubreddits.list.includes(subreddit) && config.reddit.bannedSubreddits.enabled === true) return await interaction.editReply({ embeds: [embedBanned] })
        let permalink
        let url
        let title
        let content
        let created
        let author
        let upvotes
        let comments

        axios.get(`https://www.reddit.com/r/${subreddit}/${sorting}/.json`)
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
                console.log(utils.prefix('error'), err)
                return await interaction.editReply({
                    embeds: [utils.embed({
                        preset: 'error',
                        title: `Unknown`,
                        description: `An unexpected error occcured, contact an administrator.`,
                    })]
                })
            })
    }
}