const Discord = require('discord.js');

const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = (type, title, description) => {
    const embed = new Discord.MessageEmbed()
    switch (type) {
        case 'default':
            embed.setColor(config.Embeds.Color.Default)
            embed.setTitle(title)
            if (description) {
                embed.setDescription(description)
            }
            embed.setFooter(config.Embeds.Footer.Text, config.Embeds.Footer.Icon);
            return embed
        case 'warn':
            embed.setColor(config.Embeds.Color.Warn)
            embed.setTitle(`Warning: ${title}`)
            if (description) {
                embed.setDescription(description)
            }
            embed.setFooter(config.Embeds.Footer.Text, config.Embeds.Footer.Icon);
            return embed
        case 'error':
            embed.setColor(config.Embeds.Color.Error)
            embed.setTitle(`Error: ${title}`)
            if (description) {
                embed.setDescription(description)
            }
            embed.setFooter(config.Embeds.Footer.Text, config.Embeds.Footer.Icon);
            return embed
        default:
            return console.log(tools.consolePrefix('warn'), tools.consoleHighlight('', `${type}`), `is not regonised as a valid embed type.`)
    }
}