const fs = require('fs')
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
});

const slash = require('@modules/slash.js')

module.exports = (client) => {
    rl.on('line', (input) => {
        switch (input) {
            case 'deploy':
                try {
                    slash(client)
                } catch (err) {
                    console.log(err)
                }
                return
            default:
                return
        }
    });
}