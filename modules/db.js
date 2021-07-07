const Database = require('better-sqlite3')
let db = new Database('data.db')

module.exports.insert = (table, columns, values) => {
    let stmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${values})`)
    stmt.run()
}

module.exports.remove = (table, conditions) => {
    let stmt = db.prepare(`DELETE FROM ${table} WHERE ${conditions}`)
    stmt.run()
}

module.exports.update = (table, columns, values, conditions) => {
    let change = ''
    for (column of columns) {
        change += `${column} = '?', `
    }
    for (value of values) {
        change = change.replace('?', `${value}`)
    }
    let stmt = db.prepare(`UPDATE ${table} SET ${change.slice(0, -2)}`)
    if (conditions) stmt = db.prepare(`UPDATE ${table} SET ${change.slice(0, -2)} WHERE ${conditions}`)
    stmt.run()
}

module.exports.select = (table, columns, scope, conditions) => {
    let stmt = db.prepare(`SELECT ${columns} FROM ${table}`)
    if (conditions) stmt = db.prepare(`SELECT ${columns} FROM ${table} WHERE ${conditions}`)
    if (scope === 'get') return stmt.get()
    if (scope === 'all') return stmt.all()
}

module.exports.create = (table, columns) => {
    let stmt = db.prepare(`CREATE TABLE IF NOT EXISTS ${table} (${columns})`)
    stmt.run()
}

module.exports.drop = (table) => {
    let stmt = db.prepare(`DROP TABLE IF EXISTS ${table}`)
    stmt.run()
}