require('dotenv').config();
const APIKey = process.env.EXCHANGE_API_KEY

const axios = require('axios')
const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const tools = require('@modules/tools.js')

module.exports = {
    commands: ['meme', 'memes'],
    expectedArgs: 'subreddit',
    maxArgs: 1,
    description: "Fetch memes from reddit",
    callback: (client, message, arguments) => {
        const defaultSubreddit = config.Meme.DefaultSubreddit
        const validSubreddits = config.Meme.ValidSubreddits
        let subreddit = arguments[0] ? arguments[0].toLowerCase() : defaultSubreddit
        if (validSubreddits.includes(subreddit)) {
            let permalink
            let URL
            let title
            let content
            let created
            let author
            let upvotes
            let comments
            axios.get(`https://www.reddit.com/r/${subreddit}/random/.json`)
                .then((data) => {
                    //console.log(data.data[0].data.children[0].data)
                    //console.log(data.data[0])
                    if (data.data[0]) {
                        if (data.data[0].data.children[0].data.over_18 === false) {
                            permalink = data.data[0].data.children[0].data.permalink
                            URL = `https://reddit.com${permalink}`
                            title = data.data[0].data.children[0].data.title
                            content = data.data[0].data.children[0].data.url
                            created = data.data[0].data.children[0].data.created_utc * 1000
                            author = data.data[0].data.children[0].data.author
                            upvotes = data.data[0].data.children[0].data.score
                            comments = data.data[0].data.children[0].data.num_comments
                            message.channel.send(embed('default', `${title}`, `Here is a meme from \`r/${subreddit}\`\n[**OPEN**](${URL})`)
                                .setImage(`${content}`)
                                .setTimestamp(created)
                                .addFields(
                                    { name: `Author`, value: `\`\`\`u/${author}\`\`\``, inline: true },
                                    { name: `Upvotes`, value: `\`\`\`${upvotes}\`\`\``, inline: true },
                                    { name: `Comments`, value: `\`\`\`${comments}\`\`\``, inline: true },
                                )
                            )
                        } else {
                            message.channel.send(over18Embed)
                            return
                        }
                    } else {
                        if (data.data.data.children[0].data.over_18 === false) {
                            permalink = data.data.data.children[0].data.permalink
                            URL = `https://reddit.com${permalink}`
                            title = data.data.data.children[0].data.title
                            content = data.data.data.children[0].data.url
                            created = data.data.data.children[0].data.created_utc * 1000
                            author = data.data.data.children[0].data.author
                            upvotes = data.data.data.children[0].data.score
                            comments = data.data.data.children[0].data.num_comments
                            message.channel.send(embed('default', `${title}`, `Here is a meme from \`r/${subreddit}\`\n[**OPEN**](${URL})`)
                                .setImage(`${content}`)
                                .setTimestamp(created)
                                .addFields(
                                    { name: `Author`, value: `\`\`\`u/${author}\`\`\``, inline: true },
                                    { name: `Upvotes`, value: `\`\`\`${upvotes}\`\`\``, inline: true },
                                    { name: `Comments`, value: `\`\`\`${comments}\`\`\``, inline: true },
                                )
                            )
                        } else {
                            message.channel.send(over18Embed)
                            return
                        }
                    }
                })
                .catch((err) => {
                    console.log(tools.consolePrefix('error'), err)
                    message.channel.send(embed('error', `Unknown`, `An unknown error occured, ask an admin to lok into it if this reapeats itself.`))
                })
        } else {
            message.channel.send(embed('error', `Invalid Subreddit`, `The subreddit \`${subreddit}\` isn't defined as a valid meme subreddit in the config, please contact server admins.\n**Valid options are:**\n\`\`\`${validSubreddits.join(', ')}\`\`\``))
        }
    },
}