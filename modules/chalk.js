const chalk = require('chalk');
module.exports = {
    info: chalk.black.bgWhite,
    warn: chalk.black.bgYellow,
    error: chalk.white.bgRed,
    url: chalk.blue.underline,
    highlight: chalk.yellow,
    highlightRed: chalk.red,
    highlightGreen: chalk.green,
    highlightBlue: chalk.blue
}