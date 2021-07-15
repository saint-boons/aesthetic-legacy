const embed = require('@modules/embed.js')
const loadYAML = require('@modules/yaml.js')
const config = loadYAML('config')

module.exports = {
    commands: ['8ball'],
    expectedArgs: 'question*',
    minArgs: 1,
    description: "Ask a question to the 8ball",
    callback: (client, message, arguments) => {
        const random = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min);
          }
        answerlist=["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes – definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don’t count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."]
        message.channel.send(embed('default', `Magic 8ball`, `We've brewed up a very real magical answer for you!`).addFields(
            { name: `Question:`, value: `\`\`\`${arguments.slice(0).join(" ")}\`\`\``, inline: false },
            { name: `Answer:`, value: `\`\`\`${answerlist[random(0, 20)]}\`\`\`'\n'`, inline: false },
        ));
    },
}