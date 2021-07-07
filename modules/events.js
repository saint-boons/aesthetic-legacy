const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const tools = require('@modules/tools.js')

module.exports = (client) => {
    if (!config.Logs.Channel) return tools.console('error', `No lig channel is defined in config.yaml`)

    const channelEvents = require(`@modules/events/channel.js`)
    const emojiEvents = require(`@modules/events/emoji.js`)
    const guildEvents = require(`@modules/events/guild.js`)
    const inviteEvents = require(`@modules/events/invite.js`)
    const roleEvents = require(`@modules/events/role.js`)

    channelEvents(client)
    emojiEvents(client)
    guildEvents(client)
    inviteEvents(client)
    roleEvents(client)
}