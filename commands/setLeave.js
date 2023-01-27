const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Leave = require('../leave-schema.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setleave')
        .setDescription('Set the leave message for your server')
        .addStringOption(option => option.setName('channel').setDescription('The channel to send the leave message in').setRequired(true))
        .addStringOption(option => option.setName('title').setDescription('The title of the leave message').setRequired(true))
        .addStringOption(option => option.setName('color').setDescription('The color of the leave message').setRequired(true).addChoices(
            { name: 'Random', value: 'random' },
            { name: 'Red', value: 'red' },
            { name: 'Green', value: 'green' },
            { name: 'Blue', value: 'blue' },
            { name: 'Yellow', value: 'yellow' },
            { name: 'Purple', value: 'purple' },
            { name: 'Pink', value: 'pink' },
            { name: 'Orange', value: 'orange' },
            { name: 'Black', value: 'black' },
            { name: 'White', value: 'white' },
            { name: 'Grey', value: 'grey' },
            { name: 'Cyan', value: 'cyan' },
            { name: 'Lime', value: 'lime' },
            { name: 'Brown', value: 'brown' },
            { name: 'Teal', value: 'teal' },
            { name: 'Silver', value: 'silver' },
            { name: 'Gold', value: 'gold' },
            { name: 'Magenta', value: 'magenta' },
            { name: 'Maroon', value: 'maroon' },
            { name: 'Olive', value: 'olive' },
            { name: 'Navy', value: 'navy' },
        ))
        .addStringOption(option => option.setName('message').setDescription('The message to send when a user leaves').setRequired(true)),
    async execute(interaction) {
        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const channel = interaction.options.getString('channel');
        const title = interaction.options.getString('title');
        function colorSorter(color) {
            // change color to hex
            switch (color) {
                case 'random':
                    return 'random';
                case 'red':
                    return '#ff0000';
                case 'green':
                    return '#00ff00';
                case 'blue':
                    return '#0000ff';
                case 'yellow':
                    return '#ffff00';
                case 'purple':
                    return '#800080';
                case 'pink':
                    return '#ffc0cb';
                case 'orange':
                    return '#ffa500';
                case 'black':
                    return '#000000';
                case 'white':
                    return '#ffffff';
                case 'grey':
                    return '#808080';
                case 'cyan':
                    return '#00ffff';
                case 'lime':
                    return '#00ff00';
                case 'brown':
                    return '#a52a2a';
                case 'teal':
                    return '#008080';
                case 'silver':
                    return '#c0c0c0';
                case 'gold':
                    return '#ffd700';
                case 'magenta':
                    return '#ff00ff';
                case 'maroon':
                    return '#800000';
                case 'olive':
                    return '#808000';
                case 'navy':
                    return '#000080';
            }
        }
        const color = await colorSorter(interaction.options.getString('color'));
        const message = interaction.options.getString('message');
        await Leave.findOneAndUpdate({
            guildID: interaction.guild.id
        }, {
            guildID: interaction.guild.id,
            leaveChannel: channel,
            leaveTitle: title,
            leaveColor: color,
            leaveMessage: message
        }, {
            upsert: true
        });
        const embed = new EmbedBuilder()
            .setTitle('Leave Message Set')
            .setDescription(`The leave message has been set to the following:\n\n**Channel:** ${channel}\n**Title:** \`${title}\`\n**Color:** \`${color}\`\n**Message:** \`${message}\``)
            .setColor(randomColor)
            .setTimestamp()
        await interaction.reply({ embeds: [embed] });
    },
    async init(client) {
        client.on('ready', async () => {
            const guilds = client.guilds.cache;
            for (const guild of guilds.values()) {
                await guild.members.fetch();
            }
    })
}
}