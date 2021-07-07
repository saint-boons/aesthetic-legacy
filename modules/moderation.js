const { client } = require('@root/index.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const db = require('@modules/db.js')
const tools = require('@modules/tools.js')

const validTypes = ['warn', 'mute', 'tempmute', 'kick', 'ban', 'tempban']
const validTime = ['s', 'm', 'h', 'd', 'w', 'M', 'mo', 'y']

add = (type, id, serverID, userID, reason) => {
    let guild = tools.getGuild(`${serverID}`)
    let member = tools.getGuildMember(`${userID}`, `${serverID}`)
    let muteRole
    if (type === 'mute' || type === 'tempmute') {
        muteRole = guild.roles.cache.find(role => role.name === config.Moderation.Mute.Role);
        if (!muteRole) {
            muteRole = guild.roles.create({
                data: {
                    name: `${config.Moderation.Mute.Role}`,
                    color: 'RED',
                },
            })
        }
    }
    switch (type) {
        case 'warn':
            return { sucess: true, id: id }
        case 'mute':
        case 'tempmute':
            if (!member.roles.highest.editable && config.Moderation.Mute.LowerRolesOnly) return { sucess: false, reason: `User ${member} cannot be muted!` }
            if (member.roles.cache.has(muteRole.id)) return { sucess: false, reason: `Cannot mute ${member}, they are already muted.` }
            member.roles.add(muteRole.id)
            return { sucess: true, id: id }
        case 'kick':
            if (!member.kickable) return { sucess: false, reason: `User ${member} cannot be kicked!` }
            member.kick({ reason: `${reason}` }).catch(err => { return { sucess: false, reason: `Unknown.` } })
            return { sucess: true, id: id }
        case 'ban':
        case 'tempban':
            if (!member.bannable) return { sucess: false, reason: `User ${member} cannot be banned!` }
            member.ban({ reason: `${reason}` }).catch(err => { return { sucess: false, reason: `Unknown.` } })
            return { sucess: true, id: id }
        default:
            return { sucess: false, reason: `Unknown.` }
    }
}

remove = (type, id, serverID, userID) => {
    let guild = tools.getGuild(`${serverID}`)
    let member = tools.getGuildMember(`${userID}`, `${serverID}`)
    let user = tools.getUser(`${userID}`)
    let muteRole
    if (type === 'mute' || type === 'tempmute') {
        muteRole = guild.roles.cache.find(role => role.name === config.Moderation.Mute.Role);
        if (!muteRole) {
            muteRole = guild.roles.create({
                data: {
                    name: `${config.Moderation.Mute.Role}`,
                    color: 'RED',
                },
            })
        }
    }
    switch (type) {
        case 'warn':
            return { sucess: true, id: id }
        case 'mute':
            if (!member.roles.highest.editable && config.Moderation.Mute.LowerRolesOnly) return { sucess: false, reason: `User ${member} cannot be unmuted!\n*They might have a higher role than I do.*` }
            if (!member.roles.cache.has(muteRole.id)) return { sucess: false, reason: `Cannot unmute ${member}, they are not muted.` }
            member.roles.remove(muteRole.id)
            return { sucess: true, id: id }
        case 'tempmute':
            if (!member.roles.highest.editable && config.Moderation.Mute.LowerRolesOnly) return { sucess: false, reason: `User ${member} cannot be unmuted!\n*They might have a higher role than I do.*` }
            if (!member.roles.cache.has(muteRole.id)) return { sucess: false, reason: `Cannot unmute ${member}, they are not muted.` }
            member.roles.remove(muteRole.id)
            return { sucess: true, id: id }
        case 'ban':
        case 'tempban':
            if (guild.member(`${userID}`)) return { sucess: false, reason: `Cannot unban ${user}, they are not banned` }
            guild.members.unban(userID).catch(err => { return { sucess: false, reason: `Unknown.` } })
            return { sucess: true, id: id }
        default:
            return { sucess: false, reason: `Unknown.` }
    }
}

module.exports.add = (type, serverID, userID, authorID, reason, length) => {
    db.create('moderation', 'id TEXT, time TIMESTAMP, active BIT, count BIT, type TEXT, serverID TEXT, userID TEXT, authorID TEXT, reason TEXT, length TIMESTAMP, runAt TIMESTAMP, removedTime TIMESTAMP, removerID TEXT, removeReason TEXT')

    if (!validTypes.includes(type)) return { sucess: false, reason: `${type} is not a valid type to add.` }
    if (length && !validTime.includes(length.slice(-1))) return { sucess: false, reason: `Invalid length! It must end in the following: \`s, m, h, d, w, M (or mo), y\`` }
    let id = tools.genID('moderation', 8)
    let response = add(`${type}`, `${id}`, `${serverID}`, `${userID}`, `${reason}`)
    if (response.sucess === false) return response
    switch (type) {
        case 'tempmute':
        case 'tempban':
            if (!length) return { sucess: false, reason: `Missing length argument!` }
            db.insert('moderation', 'id, time, active, count, type, serverID, userID, authorID, reason, length, runAt', `'${id}', ${Date.now()}, 1, 1, '${type}', '${serverID}', '${userID}', '${authorID}', '${reason}', ${tools.timeStringToMS(length)}, ${Date.now() + tools.timeStringToMS(length)}`)
            break
        case 'kick':
            db.insert('moderation', 'id, time, active, count, type, serverID, userID, authorID, reason', `'${id}', ${Date.now()}, 0, 1, '${type}', '${serverID}', '${userID}', '${authorID}', '${reason}'`)
            break
        default:
            db.insert('moderation', 'id, time, active, count, type, serverID, userID, authorID, reason', `'${id}', ${Date.now()}, 1, 1, '${type}', '${serverID}', '${userID}', '${authorID}', '${reason}'`)
            break
    }
    return response
}

module.exports.remove = (type, serverID, userID, removerID, reason) => {
    db.create('moderation', 'id TEXT, time TIMESTAMP, active BIT, count BIT, type TEXT, serverID TEXT, userID TEXT, authorID TEXT, reason TEXT, length TIMESTAMP, runAt TIMESTAMP, removedTime TIMESTAMP, removerID TEXT, removeReason TEXT')

    if (!validTypes.includes(type) || type === 'kick') return { sucess: false, reason: `${type} is not a valid type to remove.` }
    let table = db.select('moderation', '*', 'get', `active = 1 AND type = '${type}' AND serverID = '${serverID}' AND userID = '${userID}'`)
    if (!table) {
        if (type === 'warn') return { sucess: false, reason: `Cannot remove warn from ${tools.getGuildMember(`${userID}`, `${serverID}`)}, they are not warned` }
        table = db.select('moderation', '*', 'get', `active = 1 AND type = '${'temp' + type}' AND serverID = '${serverID}' AND userID = '${userID}'`)
        if (!table) return { sucess: false, reason: `1` }
    }
    let response = remove(`${type}`, `${table.id}`, `${serverID}`, `${userID}`)
    if (response.sucess === false) return response
    if (table) db.update('moderation', ['active', 'removedTime', 'removerID', 'removeReason'], [0, Date.now(), removerID, reason], `id = ${table.id}`)
    return response
}

module.exports.run = () => {
    db.create('moderation', 'id TEXT, time TIMESTAMP, active BIT, count BIT, type TEXT, serverID TEXT, userID TEXT, authorID TEXT, reason TEXT, length TIMESTAMP, runAt TIMESTAMP, removedTime TIMESTAMP, removerID TEXT, removeReason TEXT')
    let table = db.select('moderation', '*', 'all', `active = 1`)
    if (table.length === 0) return
    for (run of table) {
        if ((Date.now() >= run.runAt) && run.runAt) {
            db.update('moderation', ['active', 'removedTime', 'removerID', 'removeReason'], [0, Date.now(), client.user.id, `Teporary Punishment: Expired`], `id = '${run.id}'`)
            remove(run.type, run.id, run.serverID, run.userID)
        }
    }
}

module.exports.check = (serverID, userID) => {
    db.create('moderation', 'id TEXT, time TIMESTAMP, active BIT, count BIT, type TEXT, serverID TEXT, userID TEXT, authorID TEXT, reason TEXT, length TIMESTAMP, runAt TIMESTAMP, removedTime TIMESTAMP, removerID TEXT, removeReason TEXT')
    let table = db.select('moderation', '*', 'all', `count = 1 AND serverID = '${serverID}' AND userID = '${userID}'`)
    let list = {
        warns: 0,
        tempmutes: 0,
        mutes: 0,
        kicks: 0,
        tempbans: 0,
        bans: 0,
    }
    for (record of table) {
        if (record.type === 'warn') list.warns += 1
        if (record.type === 'tempmute') list.tempmutes += 1
        if (record.type === 'mute') list.mutes += 1
        if (record.type === 'kick') list.kicks += 1
        if (record.type === 'tempban') list.tempbans += 1
        if (record.type === 'ban') list.bans += 1
    }
    let autoTable = db.select('moderation', '*', 'all', `active = 1 AND count = 1 AND serverID = '${serverID}' AND userID = '${userID}' AND authorID = '${client.user.id}'`)
    let autoList = {
        warns: 0,
        tempmutes: 0,
        mutes: 0,
        kicks: 0,
        tempbans: 0,
        bans: 0,
    }
    for (record of autoTable) {
        if (record.type === 'warn') autoList.warns += 1
        if (record.type === 'tempmute') autoList.tempmutes += 1
        if (record.type === 'mute') autoList.mutes += 1
        if (record.type === 'kick') autoList.kicks += 1
        if (record.type === 'tempban') autoList.tempbans += 1
        if (record.type === 'ban') autoList.bans += 1
    }

    for (auto of config.Moderation.AutoMod) {
        let length
        switch (auto[1]) {
            case 'warn':
                if (list.warns !== auto[0]) break
                if (autoList.warns > 1) break
                if (auto[2] === 'tempmute' || auto[2] === 'tempban') length = auto[3]
                let response = exports.add(`${auto[2]}`, serverID, userID, client.user.id, `Automod: Threshold reached`, `${length}`)
                console.log(response)
                break
            case 'tempmute':
                if (list.tempmutes !== auto[0]) break
                if (autoList.tempmutes > 1) break
                if (auto[2] === 'tempmute' || auto[2] === 'tempban') length = auto[3]
                exports.add(`${auto[2]}`, serverID, userID, client.user.id, `Automod: Threshold reached`, `${length}`)
                break
            case 'mute':
                if (list.mutes !== auto[0]) break
                if (autoList.mutes > 1) break
                if (auto[2] === 'tempmute' || auto[2] === 'tempban') length = auto[3]
                exports.add(`${auto[2]}`, serverID, userID, client.user.id, `Automod: Threshold reached`, `${length}`)
                break
            case 'kick':
                if (list.kicks !== auto[0]) break
                if (autoList.kicks > 1) break
                if (auto[2] === 'tempmute' || auto[2] === 'tempban') length = auto[3]
                exports.add(`${auto[2]}`, serverID, userID, client.user.id, `Automod: Threshold reached`, `${length}`)
                break
            case 'tempban':
                if (list.tempbans !== auto[0]) break
                if (autoList.tempbans > 1) break
                if (auto[2] === 'tempmute' || auto[2] === 'tempban') length = auto[3]
                exports.add(`${auto[2]}`, serverID, userID, client.user.id, `Automod: Threshold reached`, `${length}`)
                break
            case 'ban':
                if (list.bans !== auto[0]) break
                if (autoList.bans > 1) break
                if (auto[2] === 'tempmute' || auto[2] === 'tempban') length = auto[3]
                exports.add(`${auto[2]}`, serverID, userID, client.user.id, `Automod: Threshold reached`, `${length}`)
                break
            default:
                break
        }
    }
}

module.exports.query = () => {

}