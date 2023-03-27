const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const linksSchema = require('../links-schema.js');
const { Emojis } = require('../statics.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-link')
        .setDescription('Create a link dispenser for your server.')
        .addStringOption(option => option.setName('name').setDescription('The name of the link dispenser. (Remember this name! You\'ll need it to add links!)').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('The description of the link dispenser.').setRequired(true))
        .addStringOption(option => option.setName('color').setDescription('The color of the link dispenser.').setRequired(true).addChoices(
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
        .addIntegerOption(option => option.setName('limit').setDescription('The number of links a person can get per month.').setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: Emojis.error + ' You do not have permission to use this command. (Requires `ADMINISTRATOR`)', ephemeral: true });
        }
        const linkName = interaction.options.getString('name');
        const linkDescription = interaction.options.getString('description');
        const linkColor = interaction.options.getString('color');
        const linkLimit = interaction.options.getInteger('limit') ? interaction.options.getInteger('limit') : "none";
        const guild = await interaction.guild.id;
        var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        function colorSorter(color) {
            // change color to hex
            switch (color) {
                case 'random':
                    return randomColor;
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
        // if already exist
        const alreadyExist = await linksSchema.findOne({
            guildID: guild,
            links: {
                $elemMatch: {
                    linkName: linkName,
                }
            }
        });
        if (alreadyExist) {
            var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            const embed = new EmbedBuilder()
                //.setTitle('Link dispenser already exists!')
                .setDescription(Emojis.error + ' A link dispenser already exists with this name.')
                .setColor(Colors.error)
                .setTimestamp()
            return await interaction.reply({ embeds: [embed] });
        }

        const linkEmbed = new EmbedBuilder()
            //.setTitle('Successfully created link dispenser!')
            .setDescription(`Successfully created the \`${linkName}\` link dispenser.`)
            .setColor(Emojis.success)
            .setTimestamp()
        await interaction.reply({ embeds: [linkEmbed] });
        await linksSchema.findOneAndUpdate(
            {
                guildID: guild,
            },
            {
                guildID: guild,
                $push: {
                    links: {
                        linkName: linkName,
                        linkDescription: linkDescription,
                        linkColor: linkColor,
                        linkLimit: linkLimit,
                        links: [],
                    }
                }
            },
            {
                upsert: true,
            }
        );
    }
}