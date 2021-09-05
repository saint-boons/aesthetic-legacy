const fs = require('fs')
const Discord = require('discord.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
//const db = require('@modules/db.js')

const chalk = require('chalk')
const colors = {
    info: chalk.black.bgWhite,
    warn: chalk.black.bgYellow,
    error: chalk.white.bgRed,
    url: chalk.blue.underline,
    highlight: chalk.yellow,
    highlightRed: chalk.red,
    highlightGreen: chalk.green,
    highlightBlue: chalk.blue
}

const timeFormat = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
}

module.exports.msToDate = (time, seconds) => {
    let ms = time
    if (seconds) ms = time * 1000
    let date = new Date(ms).toLocaleString(`${config.locale}`, timeFormat)
    return date
}

module.exports.simplifyDate = (date) => {
    return new Date(date).toLocaleString(`${config.locale}`, timeFormat)
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
    let time = end ? end - start : Date.now() - start
    if (time === 1) return `${Math.floor(time)} milisecond`
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

module.exports.title = (str) => {
    return str.replace(/\b\S/g, (t) => t.toUpperCase())
}

module.exports.prefix = (type, style, custom) => {
    switch (type) {
        case 'info':
            return colors.info(config.consoleStyle.prefix.info)
        case 'warn':
            return colors.warn(config.consoleStyle.prefix.warn)
        case 'error':
            return colors.error(config.consoleStyle.prefix.error)
        case 'custom':
            switch (style) {
                case 'info':
                    return colors.info(custom)
                case 'warn':
                    return colors.warn(custom)
                case 'error':
                    return colors.error(custom)
                default:
                    return
            }
        default:
            return
    }
}

module.exports.highlight = (arguments) => {
    switch (arguments.color) {
        case 'red':
            return colors.highlightRed(arguments.text)
        case 'green':
            return colors.highlightGreen(arguments.text)
        case 'blue':
            return colors.highlightBlue(arguments.text)
        case 'url':
            return colors.url(arguments.text)
        case 'yellow':
        default:
            return colors.highlight(arguments.text)
    }
}

module.exports.getGuild = (client, serverID) => {
    let guild = client.guilds.cache.get(`${serverID}`)
    return guild
}

module.exports.getUser = (client, userID) => {
    let user = client.users.cache.get(`${userID}`)
    return user
}

module.exports.getGuildMember = (client, userID, guildID) => {
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

module.exports.randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

module.exports.embed = (arguments) => {
    let embed = new Discord.MessageEmbed()
    if (arguments.preset) {
        switch (arguments.preset) {
            case 'default':
                embed.setColor(config.embed.color.default)
                break
            case 'warn':
                embed.setColor(config.embed.color.warn)
                if (arguments.title) embed.setTitle(`Warn: ${arguments.title}`)
                break
            case 'error':
                embed.setColor(config.embed.color.error)
                if (arguments.title) embed.setTitle(`Error: ${arguments.title}`)
                break
        }
        embed.setFooter(config.embed.footer.text, config.embed.footer.icon)
    }
    if (arguments.title) embed.setTitle(arguments.title)
    if (arguments.color) {
        if (arguments.color === 'default') {
            embed.setColor(config.embed.color.default)
        } else {
            embed.setColor(arguments.color)
        }
    }
    if (arguments.description) embed.setDescription(arguments.description)
    if (arguments.fields) embed.addFields(arguments.fields)
    if (arguments.footer) {
        if (arguments.footer === 'default') {
            embed.setFooter(config.embed.footer.text, config.embed.footer.icon)
        } else {
            embed.setFooter(arguments.footer)
        }
    }
    if (arguments.image) embed.setImage(arguments.image)
    if (arguments.thumbnail) embed.setThumbnail(arguments.thumbnail)
    if (arguments.timestamp) {
        if (arguments.timestamp === 'now') {
            embed.setTimestamp()
        } else {
            embed.setTimestamp(arguments.timestamp)
        }
    }
    if (arguments.url) embed.setURL(arguments.url)
    if (arguments.author) embed.setAuthor(arguments.author)
    return embed
}

module.exports.button = (arguments) => {
    let button = new Discord.MessageButton()
        .setCustomId(arguments.id)
        .setLabel(arguments.label)
        .setStyle(arguments.style)
    if (arguments.disabled) button.setDisabled(arguments.disabled)
    if (arguments.emoji) button.setEmoji(arguments.emoji)
    return button
}

module.exports.menu = (arguments) => {
    let menu = new Discord.MessageSelectMenu()
        .setCustomId(arguments.id)
        .setPlaceholder(arguments.placeholder)
        .addOptions(arguments.options)
    if (arguments.min) menu.setMinValues(arguments.min)
    if (arguments.max) menu.setMaxValues(arguments.max)
    return menu
}

module.exports.row = (components) => {
    const row = new Discord.MessageActionRow()
        .addComponents(components)
    return row
}

module.exports.getCommandCategories = () => {
    return fs.readdirSync('commands').filter(directory => !directory.startsWith('.'))
}

module.exports.getCommandFiles = (category) => {
    let categories = fs.readdirSync('commands').filter(directory => !directory.startsWith('.'))
    categories.push('')
    if (!categories.includes(category)) return
    if (category === '') return fs.readdirSync(`commands`).filter(file => file.endsWith('.js'))
    return fs.readdirSync(`commands/${category}`).filter(file => file.endsWith('.js'))
}

module.exports.getCommand = (category, command) => {
    let categories = fs.readdirSync('commands').filter(directory => !directory.startsWith('.'))
    categories.push('')
    if (!categories.includes(category)) return
    if (category === '') return require(`../commands/${command}`)
    return require(`../commands/${category}/${command}`)
}

module.exports.getInteractionCategories = () => {
    return fs.readdirSync('modules/interactions').filter(directory => !directory.startsWith('.'))
}

module.exports.getInteractionSubcategories = (category) => {
    let categories = exports.getInteractionCategories()
    categories.push('')
    if (!categories.includes(category)) return
    if (category === '') return fs.readdirSync(`modules/interactions`).filter(directory => !directory.startsWith('.'))
    return fs.readdirSync(`modules/interactions/${category}`).filter(directory => !directory.startsWith('.'))
}

module.exports.getInteractionFiles = (category, subcategory) => {
    let categories = exports.getInteractionCategories()
    categories.push('')
    let subcategories = exports.getInteractionSubcategories(category)
    subcategories.push('')
    if (!categories.includes(category) || !subcategories.includes(subcategory)) return
    if (category === '') return fs.readdirSync(`modules/interactions`).filter(file => file.endsWith('.js'))
    if (subcategory === '') return fs.readdirSync(`modules/interactions/${category}`).filter(file => file.endsWith('.js'))
    return fs.readdirSync(`modules/interactions/${category}/${subcategory}`).filter(file => file.endsWith('.js'))
}