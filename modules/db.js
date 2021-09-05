const Database = require('better-sqlite3')
let db = new Database('data.db')

module.exports.insert = (arguments) => {
    let stmt = db.prepare(`INSERT INTO ${arguments.table} (${arguments.columns}) VALUES (${arguments.values})`)
    stmt.run()
}

module.exports.remove = (arguments) => {
    let stmt = db.prepare(`DELETE FROM ${arguments.table} WHERE ${arguments.conditions}`)
    stmt.run()
}

module.exports.update = (arguments) => {
    let change = ''
    for (column of arguments.columns) {
        change += `${column} = '?', `
    }
    for (value of arguments.values) {
        change = change.replace('?', `${value}`)
    }
    let stmt
    if (!arguments.conditions) stmt = db.prepare(`UPDATE ${arguments.table} SET ${change.slice(0, -2)}`)
    if (arguments.conditions) stmt = db.prepare(`UPDATE ${arguments.table} SET ${change.slice(0, -2)} WHERE ${arguments.conditions}`)
    stmt.run()
}

module.exports.select = (arguments) => {
    let stmt
    if (!arguments.conditions) stmp = db.prepare(`SELECT ${arguments.columns} FROM ${arguments.table}`)
    if (arguments.conditions) stmt = db.prepare(`SELECT ${arguments.columns} FROM ${arguments.table} WHERE ${arguments.conditions}`)
    if (arguments.scope === 'get') return stmt.get()
    if (arguments.scope === 'all') return stmt.all()
}

module.exports.create = (arguments) => {
    let stmt = db.prepare(`CREATE TABLE IF NOT EXISTS ${arguments.table} (${arguments.columns})`)
    stmt.run()
}

module.exports.drop = (table) => {
    let stmt = db.prepare(`DROP TABLE IF EXISTS ${table}`)
    stmt.run()
}

module.exports.custom = (string) => {
    let stmt = db.prepare(`${string}`)
    stmt.run()
}