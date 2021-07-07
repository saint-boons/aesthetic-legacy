const fs = require('fs');
const yaml = require('js-yaml');

// YAML file locations
const configYAMLFile = './config.yaml'

// Get config anyways for console prefixes
let configFileContent = fs.readFileSync(configYAMLFile, 'utf8');
let config = yaml.load(configFileContent);



module.exports = (file) => {
    switch (file) {
        case 'config':
            try {
                let configFileContent = fs.readFileSync(configYAMLFile, 'utf8');
                let config = yaml.load(configFileContent);
                return config
            } catch (err) {
                console.log(tools.consolePrefix('custom', 'error', 'FATAL ERROR >'), err);
                break
            }
        default:
            return console.log(tools.consolePrefix('custom', 'error', 'FATAL ERROR >'), tools.consoleHighlight('', `${file}`), `does not exist or isn't reconised as a YAML config/lang file`)
    }
}