const utils = require('@modules/utils')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = (client) => {
    let statusIndex = 0
    const setStatus = () => {
        let status
        if (config.status.ordered) {
            if (!config.status.list[statusIndex]) statusIndex = 0
            status = config.status.list[statusIndex]
            statusIndex ++
        } else {
            status = config.status.list[utils.randomNumber(0, config.status.list.length)]
        }
        client.user.setPresence({
            status: status.status,
            activities: [{
                name: status.name,
                type: status.type,
                uril: status.url
            }]
        });
        setTimeout(setStatus, config.status.interval)
    }
    setStatus()

    //
}