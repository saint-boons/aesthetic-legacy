const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const axios = require('axios')
const tools = require('@modules/tools.js')

require('dotenv').config();
const APIKey = process.env.EXCHANGE_API_KEY
// Get a key at https://www.exchangerate-api.com

module.exports = {
    commands: ['currency', 'fiat', 'exchange-rate', 'exchangerate', 'convert-money', 'convertmoney'],
    expectedArgs: 'base-code* to-code amount',
    minArgs: 1,
    maxArgs: 3,
    description: "Get the exchange rate of a currency or convert it with another",
    callback: (client, message, arguments) => {
        let baseCurrency = arguments[0].toUpperCase()
        let toCurrency = arguments[1] ? arguments[1].toUpperCase() : 'none'
        let amount = arguments[2] ? Number(arguments[2]) : 1
        let type
        if (baseCurrency.length !== 3) {
            message.channel.send(embed('error', `Invalid Currency Code`, `\`${baseCurrency}\` isn't a valid currency code.\nExamples of valid codes:`).addFields(
                { name: `Euro`, value: `\`\`\`EUR\`\`\``, inline: true },
                { name: `US Dollar`, value: `\`\`\`USD\`\`\``, inline: true },
                { name: `British Pound`, value: `\`\`\`GBP\`\`\``, inline: true },
            ))
            return
        }
        if (arguments.length === 1) {
            type = 'rate'
        } else {
            if (toCurrency.length !== 3) {
                message.channel.send(embed('error', `Invalid Currency Code`, `\`${toCurrency}\` isn't a valid currency code.\nExamples of valid codes:`).addFields(
                    { name: `Euro`, value: `\`EUR\``, inline: true },
                    { name: `US Dollar`, value: `\`USD\``, inline: true },
                    { name: `British Pound`, value: `\`GBP\``, inline: true },
                ))
                return
            }
            if (amount < config.Currency.Convert.MinimumAmount || amount > config.Currency.Convert.MaximumAmount) {
                message.channel.send(embed('error', `Invalid Amount`, `\`${amount}\` isn't a valid amount, it should be within \`${config.Currency.Convert.MinimumAmount}\` and \`${config.Currency.Convert.MaximumAmount}\``))
                return
            }
            type = 'convert'
        }

        switch (type) {
            case 'rate':
                let symbols = config.Currency.Rate.Symbols.filter(symbol => symbol !== baseCurrency)
                axios.get(`https://v6.exchangerate-api.com/v6/${APIKey}/latest/${baseCurrency}`)
                    .then((data) => {
                        if (data.data.result === 'success') {
                            rateEmbed = embed('default', `Currency Exchange Rate`, `Here is the exchange rate of \`${baseCurrency}\` to other common currencies.`).addField(`\`${baseCurrency}\` → `, `\`\`\`${amount}\`\`\``, false)
                            for (symbol of symbols) {
                                rateEmbed.addField(`\`${symbol}\``, `\`\`\`${data.data.conversion_rates[symbol]}\`\`\``, true)
                            }
                            rateEmbed.addField(`Updated At`, `\`\`\`${data.data.time_last_update_utc}\`\`\``, false)
                            message.channel.send(rateEmbed)
                        } else if (data.data["error-type"] === 'unsupported-code') {
                            message.channel.send(embed('error', `Unsupported Code`, `The code \`${baseCurrency}\` isn't supported or doesn't exist.`))
                        } else {
                            message.channel.send(embed('error', `Unknown`, `An unknown error occured, ask an admin to look into it.`))
                            console.log(tools.consolePrefix('error'), data.data)
                        }
                    })
                    .catch((err) => {
                        console.log(tools.consolePrefix('error'), err)
                    })
                return
            case 'convert':
                axios.get(`https://v6.exchangerate-api.com/v6/${APIKey}/pair/${baseCurrency}/${toCurrency}`)
                    .then((data) => {
                        if (data.data.result === 'success') {
                            let convertedAmount = amount * data.data.conversion_rate
                            let weakerCurrency = amount < convertedAmount ? toCurrency : baseCurrency
                            message.channel.send(embed('default', `Currency Conversion`, `Here is the exchange rate of \`${baseCurrency}\` to \`${toCurrency}\`.`).addFields(
                                { name: `\`${baseCurrency}\` → \`${toCurrency}\``, value: `\`\`\`${amount} ${baseCurrency} = ${convertedAmount} ${toCurrency}\`\`\``, inline: false },
                                { name: `Convertion Rate`, value: `\`\`\`${data.data.conversion_rate}\`\`\``, inline: true },
                                { name: `Weaker Currency`, value: `\`\`\`${weakerCurrency}\`\`\``, inline: true },
                                { name: `Updated At`, value: `\`\`\`${data.data.time_last_update_utc}\`\`\``, inline: false },
                            ))
                        } else if (data.data["error-type"] === 'unsupported-code') {
                            message.channel.send(embed('error', `Unsupported Code`, `The codes \`${baseCurrency}\` or/and \`${toCurrency}\` isn't supported or doesn't exist.`))
                        } else {
                            message.channel.send(embed('error', `Unknown`, `An unknown error occured, ask an admin to look into it.`))
                            console.log(tools.consolePrefix('error'), data.data)
                        }
                    })
                    .catch((err) => {
                        console.log(tools.consolePrefix('error'), err)
                    })
                return
            default:
                return
        }
    },
}