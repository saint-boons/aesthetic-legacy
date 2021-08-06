const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const tools = require('@modules/tools.js')
const embed = require('@modules/embed.js')
const moderation = require('@modules/moderation.js')

module.exports = {
    commands: ['modlookup', 'modlook'],
    expectedArgs: 'user*/modID*',
    minArgs: 1,
    maxArgs: 1,
    requiredRoles: ['Mod'],
    serverOnly: true,
    description: "Warn a member",
    callback: (client, message, arguments) => {
        if (message.mentions.members.first()) {
            let target = message.mentions.members.first()
            let query = moderation.query(message.guild.id, target.id)
            if (query.sucess === false) return message.channel.send(embed('error', 'Moderation', `${response.reason}`))

            let records = ''
            if (query.count.mutes !== 0) {
                let index = 0
                let mutes = ''
                while (query.details.mutes[index]) {
                    let author = tools.getUser(query.details.mutes[index].authorID)
                    mutes += `> ${tools.msToDate(query.details.tempmutes[index].time)} - ID: ${query.details.mutes[index].id} - A/C: ${query.details.mutes[index].active}/${query.details.mutes[index].count} - Author: ${author.username}#${author.discriminator} - Reason: ${query.details.mutes[index].reason}\n`
                    index += 1
                }
                records += `\`\`\`Mutes: (${query.count.mutes})\n${mutes}\`\`\``
            }
            if (query.count.tempmutes !== 0) {
                let index = 0
                let tempmutes = ''
                while (query.details.tempmutes[index]) {
                    let author = tools.getUser(query.details.tempmutes[index].authorID)
                    let wording = query.details.tempmutes[index].runAt >= Date.now() ? 'Expires' : `Expired`
                    tempmutes += `> ${tools.msToDate(query.details.tempmutes[index].time)} - ID: ${query.details.tempmutes[index].id} - A/C: ${query.details.tempmutes[index].active}/${query.details.tempmutes[index].count} - Author: ${author.username}#${author.discriminator} - ${wording}: ${tools.msToDate(query.details.tempmutes[index].runAt)} - Reason: ${query.details.tempmutes[index].reason}\n`
                    index += 1
                }
                records += `\`\`\`Temp Mutes: (${query.count.tempmutes})\n${tempmutes}\`\`\``
            }
            if (query.count.bans !== 0) {
                let index = 0
                let bans = ''
                while (query.details.bans[index]) {
                    let author = tools.getUser(query.details.bans[index].authorID)
                    bans += `> ${tools.msToDate(query.details.tempmutes[index].time)} - ID: ${query.details.bans[index].id} - A/C: ${query.details.bans[index].active}/${query.details.bans[index].count} - Author: ${author.username}#${author.discriminator} - Reason: ${query.details.bans[index].reason}\n`
                    index += 1
                }
                records += `\`\`\`Bans: (${query.count.bans})\n${bans}\`\`\``
            }
            if (query.count.tempbans !== 0) {
                let index = 0
                let tempbans = ''
                while (query.details.tempbans[index]) {
                    let author = tools.getUser(query.details.tempbans[index].authorID)
                    let wording = query.details.tempbans[index].runAt >= Date.now() ? 'Expired' : 'Expires'
                    tempbans += `> ${tools.msToDate(query.details.tempmutes[index].time)} - ID: ${query.details.tempbans[index].id} - A/C: ${query.details.tempbans[index].active}/${query.details.tempbans[index].count} - Author: ${author.username}#${author.discriminator} - ${wording}: ${tools.msToDate(query.details.tempbans[index].runAt)} - Reason: ${query.details.tempbans[index].reason}\n`
                    index += 1
                }
                records += `\`\`\`Temp Bans: (${query.count.tempbans})\n${tempbans}\`\`\``
            }
            if (query.count.warns !== 0) {
                let index = 0
                let warns = ''
                while (query.details.warns[index]) {
                    let author = tools.getUser(query.details.warns[index].authorID)
                    warns += `> ${tools.msToDate(query.details.tempmutes[index].time)} - ID: ${query.details.warns[index].id} - A/C: ${query.details.warns[index].active}/${query.details.warns[index].count} - Author: ${author.username}#${author.discriminator} - Reason: ${query.details.warns[index].reason}\n`
                    index += 1
                }
                records += `\`\`\`Warns: (${query.count.warns})\n${warns}\`\`\``
            }
            if (query.count.kicks !== 0) {
                let index = 0
                let kicks = ''
                while (query.details.kicks[index]) {
                    let author = tools.getUser(query.details.kicks[index].authorID)
                    kicks += `> ${tools.msToDate(query.details.tempmutes[index].time)} - ID: ${query.details.kicks[index].id} - A/C: ${query.details.kicks[index].active}/${query.details.kicks[index].count} - Author: ${author.username}#${author.discriminator} - Reason: ${query.details.kicks[index].reason}\n`
                    index += 1
                }
                records += `\`\`\`Kicks: (${query.count.kicks})\n${kicks}\`\`\``
            }

            message.channel.send(embed('default', `Lookup Results for \`${target.user.username}#${target.user.discriminator}\``, `\`\`\`Mutes: ${query.count.mutes}      Temp Mutes: ${query.count.tempmutes}\nBans:  ${query.count.bans}      Temp Bans:  ${query.count.tempbans}\nWarns: ${query.count.warns}      Kicks:      ${query.count.kicks}\nTotal: ${query.count.mutes + query.count.tempmutes + query.count.bans + query.count.tempbans + query.count.warns + query.count.kicks}\`\`\`\nThe full records are shown bellow this embed.\n\`A/C\` stands for \`Active\` & \`Count\` values.`))
            return message.channel.send(records)
        } else {
            let fetch = moderation.fetch(message.guild.id, arguments[1])
            if (fetch.sucess === false) return message.channel.send(embed('error', 'Moderation', `${response.reason}`))
            let fetchEmbed = message.channel.send(embed('default', `Lookup Results for \`${arguments[1]}\``, `\`A/C\` stands for \`Active\` & \`Count\` values.`).addFields(
                { name: `ID`, value: `\`\`\`${fetch.id}\`\`\``, inline: true },
                { name: `A/C`, value: `\`\`\`${fetch.active}/${fetch.count}\`\`\``, inline: true },
                { name: `Type`, value: `\`\`\`${fetch.type}\`\`\``, inline: true },
                { name: `Member`, value: `${tools.getUser(fetch.userID)}`, inline: true },
                { name: `Author`, value: `${tools.getUser(fetch.authorID)}`, inline: true },
                { name: `Reason`, value: `\`\`\`${fetch.reason}\`\`\``, inline: false },
            ).setTimestamp(fetch.time))
            if (fetch.type === 'tempmute' || fetch.type === 'tempban') {
                if (fetch.runAt >= Date.now()) fetchEmbed.addField('Expires', `${tools.msToDate(fetch.runAt)}`, false)
                else fetchEmbed.addField('Expired', `${tools.msToDate(fetch.runAt)}`, false)
            }
            return fetchEmbed
        }
    }
}