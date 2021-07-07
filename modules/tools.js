const { client } = require('@root/index.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const db = require('@modules/db.js')
const chalk = require('@modules/chalk.js')

module.exports.msToDate = (time, seconds) => {
    let format = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };
    let ms = time
    if (seconds) ms = time * 1000
    let date = new Date(ms).toLocaleString(`${config.Locale}`, format)
    return date
}

module.exports.timeStringToMS = (string) => {
    switch (string.slice(-1)) {
        case 's':
            return Number(string.slice(0, -1)) * 1000
        case 'm':
            return Number(string.slice(0, -1)) * 60000
        case 'h':
            return Number(string.slice(0, -1)) * 3600000
        case 'd':
            return Number(string.slice(0, -1)) * 86400000
        case 'w':
            return Number(string.slice(0, -1)) * 604800000
        case 'M':
        case 'mo':
            return Number(string.slice(0, -1)) * 2629800000
        case 'y':
            return Number(string.slice(0, -1)) * 31557600000
        default:
            return 'Invalid time length, must end in the following: s, m, h, d, w, M (or mo), y'
    }
}

module.exports.timeSince = (start, end) => {
    let time = end - start
    if (time = 1) return `${Math.floor(time)} milisecond`
    if (time < 1000) return `${Math.floor(time)} miliseconds`
    if (time < 2000) return `${Math.floor(time / 1000)} second`
    if (time < 60000) return `${Math.floor(time / 1000)} seconds`
    if (time < 120000) return `${Math.floor(time / 60000)} minute`
    if (time < 3600000) return `${Math.floor(time / 60000)} minutes`
    if (time < 7200000) return `${Math.floor(time / 3600000)} hour`
    if (time < 86400000) return `${Math.floor(time / 3600000)} hours`
    if (time < 172800000) return `${Math.floor(time / 86400000)} day`
    if (time < 2629800000) return `${Math.floor(time / 86400000)} days`
    if (time < 5259600000) return `${Math.floor(time / 2629800000)} month`
    if (time < 31557600000) return `${Math.floor(time / 2629800000)} months`
    if (time < 63115200000) return `${Math.floor(time / 31557600000)} year`
    if (time >= 63115200000) return `${Math.floor(time / 31557600000)} years`
    return
}

module.exports.consolePrefix = (type, style, custom) => {
    switch (type) {
        case 'info':
            return chalk.info(config.ConsoleStyle.Prefix.Info)
        case 'warn':
            return chalk.warn(config.ConsoleStyle.Prefix.Warn)
        case 'error':
            return chalk.error(config.ConsoleStyle.Prefix.Error)
        case 'custom':
            switch (style) {
                case 'info':
                    return chalk.info(custom)
                case 'warn':
                    return chalk.warn(custom)
                case 'error':
                    return chalk.error(custom)
                default:
                    return
            }
        default:
            return
    }
}

module.exports.consoleHighlight = (type, string) => {
    switch (type) {
        case 'red':
            return chalk.highlightRed(string)
        case 'green':
            return chalk.highlightGreen(string)
        case 'blue':
            return chalk.highlightBlue(string)
        case 'url':
            return chalk.url(string)
        case 'yellow':
        default:
            return chalk.highlight(string)
    }
}

module.exports.getGuild = (serverID) => {
    let guild = client.guilds.cache.get(`${serverID}`)
    return guild
}

module.exports.getUser = (userID) => {
    let user = client.users.cache.get(`${userID}`)
    return user
}

module.exports.getGuildMember = (userID, guildID) => {
    let guild = client.guilds.cache.get(`${guildID}`)
    let user = guild.members.cache.get(`${userID}`)
    return user
}

module.exports.genID = (table, length) => {
    let multiplier = ''
    for (x = 0; x < length; x++) multiplier += '9'
    let IDs = db.select(`'${table}'`, 'id', 'all')
    let ID = Math.floor(Math.random() * multiplier)
    ID = ID.toString().padStart(length, '0')
    while (IDs.includes(ID)) {
        ID = Math.floor(Math.random() * multiplier)
        ID = ID.toString().padStart(length, '0')
    }
    return ID
}