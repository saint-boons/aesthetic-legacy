const utils = require('@modules/utils')
const fs = require('fs');
const yaml = require('js-yaml');

const paths = {
    config: './config.yaml',
}

module.exports = (file) => {
    switch (file) {
        case 'config':
            try {
                return yaml.load(fs.readFileSync(paths.config, 'utf8'))
            } catch (err) {
                return console.log(utils.prefix('custom', 'error', 'FATAL ERROR >'), err)
            }
        default:
            return console.log(utils.prefix('custom', 'error', 'FATAL ERROR >'), utils.highlight({ text: `${file}` }), `does not exist or isn't reconised as a YAML config/lang file`)
    }
}