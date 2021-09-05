const utils = require('@modules/utils')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')
const axios = require('axios');
const { execute } = require('../general/help');

require('dotenv').config();
const key = process.env.EXCHANGE_API_KEY
// Get a key at https://www.exchangerate-api.com

const validCodes = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BOV', 'BRL', 'BSD', 'BTN', 'BWP', 'BYR', 'BZD', 'CAD', 'CDF', 'CHE', 'CHF', 'CHW', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MXV', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'STD', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'USN', 'USS', 'UYI', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC', 'XBD', 'XCD', 'XDR', 'XFU', 'XOF', 'XPD', 'XPF', 'XPT', 'XTS', 'XXX', 'YER', 'ZAR', 'ZMW']

module.exports = {
    name: 'currency',
    description: 'Get the exchange rate of a currency or convert it with another',
    options: [
        {
            name: 'base',
            type: 3,
            description: 'Base currency code',
            required: true,
        },
        {
            name: 'target',
            type: 3,
            description: 'Target currency code',
            required: false,
        },
        {
            name: 'amount',
            type: 4,
            description: 'Ammount of base currency to convert',
            required: false,
        },
    ],
    async execute(interaction, client) {
        const base = interaction.options.getString('base').toUpperCase()
        const amount = interaction.options.getInteger('amount') ? interaction.options.getInteger('amount') : 1
        if (amount < config.currency.amount.min || amount > config.currency.amount.max) return await interaction.editReply({
            embeds: [utils.embed({
                preset: 'error',
                title: `Currency Amount Invalid`,
                description: `\`${amount}\` isn't a valid amount, it should be within \`${config.currency.amount.min}\` and \`${config.currency.amount.max}\``,
            })]
        })
        if (!validCodes.includes(base)) return await interaction.editReply({
            embeds: [utils.embed({
                preset: 'error',
                title: `Unknown Code`,
                description: `\`${base}\` is not reconised as a valid code.\nValid codes are part of **ISO 4217**`,
                fields: [
                    { name: `Links to valid codes`, value: `[**ISO 4217 on Wikipedia**](https://en.wikipedia.org/wiki/ISO_4217)\n[**Exchange Rate API Supported Currencies**](https://www.exchangerate-api.com/docs/supported-currencies)`, inline: true }
                ]
            })]
        })

        if (interaction.options.getString('target')) {
            const target = interaction.options.getString('target').toUpperCase()
            if (!validCodes.includes(target)) return await interaction.editReply({
                embeds: [utils.embed({
                    preset: 'error',
                    title: `Unknown Code`,
                    description: `\`${target}\` is not reconised as a valid code.\nValid codes are part of **ISO 4217**`,
                    fields: [
                        { name: `Links to valid codes`, value: `[**ISO 4217 on Wikipedia**](https://en.wikipedia.org/wiki/ISO_4217)\n[**Exchange Rate API Supported Currencies**](https://www.exchangerate-api.com/docs/supported-currencies)`, inline: true }
                    ]
                })]
            })
            axios.get(`https://v6.exchangerate-api.com/v6/${key}/pair/${base}/${target}`)
                .then(async (data) => {
                    if (data.data.result === 'success') {
                        let converted = amount * data.data.conversion_rate
                        let weaker = amount < converted ? target : base
                        return await interaction.editReply({
                            embeds: [utils.embed({
                                preset: 'default',
                                title: `\`${base}\` → \`${target}\` Conversion`,
                                description: `Here is the exchange rate of \`${base}\` to \`${target}\`.\n\`\`\`${amount} ${base} = ${(converted).toFixed(2)} ${target}\`\`\``,
                                fields: [
                                    { name: `Convertion Rate`, value: `\`\`\`${data.data.conversion_rate}\`\`\``, inline: true },
                                    { name: `Weaker Currency`, value: `\`\`\`${weaker}\`\`\``, inline: true },
                                    { name: `Updated At`, value: `\`\`\`${utils.simplifyDate(data.data.time_last_update_utc)}\`\`\``, inline: false },
                                ]
                            })]
                        })
                    } else if (data.data["error-type"] === 'unsupported-code') {
                        return await interaction.editReply({
                            embeds: [utils.embed({
                                preset: 'error',
                                title: `Unknown Code`,
                                description: `\`${base}\` is not reconised as a valid code.\nValid codes are part of **ISO 4217**`,
                                fields: [
                                    { name: `Links to valid codes`, value: `[**ISO 4217 on Wikipedia**](https://en.wikipedia.org/wiki/ISO_4217)\n[**Exchange Rate API Supported Currencies**](https://www.exchangerate-api.com/docs/supported-currencies)`, inline: true }
                                ]
                            })]
                        })
                    } else {
                        console.log(utils.prefix('error'), data.data)
                        return await interaction.editReply({
                            embeds: [utils.embed({
                                preset: 'error',
                                title: `Unknown`,
                                description: `An unexpected error occcured, contact an administrator.`,
                            })]
                        })
                    }
                })
                .catch((err) => {
                    console.log(utils.prefix('error'), err)
                })
        } else {
            let symbols = config.currency.symbols.filter(symbol => symbol !== base)
            axios.get(`https://v6.exchangerate-api.com/v6/${key}/latest/${base}`)
                .then(async (data) => {
                    if (data.data.result === 'success') {
                        embed = utils.embed({
                            preset: 'default',
                            title: `\`${base}\` Exchange Rate`,
                            description: `Here is the exchange rate of \`${base}\` to other common currencies.`,
                            fields: [
                                { name: `\`${base}\` → `, value: `\`\`\`${amount}\`\`\``, inline: false }
                            ]
                        })
                        for (symbol of symbols) {
                            embed.addField(`\`${symbol}\``, `\`\`\`${(amount * data.data.conversion_rates[symbol]).toFixed(2)}\`\`\``, true)
                        }
                        embed.addField(`Updated At`, `\`\`\`${utils.simplifyDate(data.data.time_last_update_utc)}\`\`\``, true)
                        return await interaction.editReply({ embeds: [embed] })
                    } else if (data.data["error-type"] === 'unsupported-code') {
                        return await interaction.editReply({
                            embeds: [utils.embed({
                                preset: 'error',
                                title: `Unknown Code`,
                                description: `\`${base}\` is not reconised as a valid code.\nValid codes are part of **ISO 4217**`,
                                fields: [
                                    { name: `Links to valid codes`, value: `[**ISO 4217 on Wikipedia**](https://en.wikipedia.org/wiki/ISO_4217)\n[**Exchange Rate API Supported Currencies**](https://www.exchangerate-api.com/docs/supported-currencies)`, inline: true }
                                ]
                            })]
                        })
                    } else {
                        console.log(utils.prefix('error'), data.data)
                        return await interaction.editReply({
                            embeds: [utils.embed({
                                preset: 'error',
                                title: `Unknown`,
                                description: `An unexpected error occcured, contact an administrator.`,
                            })]
                        })
                    }
                })
                .catch((err) => {
                    console.log(utils.prefix('error'), err)
                })
        }
    }
}