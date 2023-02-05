const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const selfroles = require('../selfroles-schema.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-panel')
        .setDescription('Create a self-role panel for your server.')
        .addStringOption(option => option.setName('panel-name').setDescription('The name of the panel. (Remember this name! Youll need it to add roles!)').setRequired(true))
        .addStringOption(option => option.setName('panel-description').setDescription('The description of the panel.').setRequired(true))
        .addStringOption(option => option.setName('panel-color').setDescription('The color of the panel.').setRequired(true).addChoices(
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
        )),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const panelName = interaction.options.getString('panel-name');
        const panelDescription = interaction.options.getString('panel-description');
        const panelColor = interaction.options.getString('panel-color');
        const guild = await interaction.guild;
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
        const alreadyExist = await selfroles.findOne({
            guildID: guild.id,
            panels: {
                $elemMatch: {
                    panelName: panelName,
                }
            }
        });
        if (alreadyExist) {
            var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            const embed = new EmbedBuilder()
                .setTitle('Panel already exists!')
                .setDescription('A panel with that name already exists! Please choose a different name.')
                .setColor(randomColor)
                .setTimestamp()
            return await interaction.reply({ embeds: [embed] });
        }

        const panelEmbed = new EmbedBuilder()
            .setTitle('Successfully created panel!')
            .setDescription(`Remember that your panel name is \`${panelName}\`! Youll need it to add roles to your panel! Run the \`/add-role\` command to add roles to your panel!`)
            .setColor(colorSorter(panelColor))
            .setTimestamp()
        await interaction.reply({ embeds: [panelEmbed] });
        await selfroles.findOneAndUpdate(
            {
                guildID: guild.id,
            },
            {
                guildID: guild.id,
                $push: {
                    panels: {
                        panelName: panelName,
                        panelDescription: panelDescription,
                        panelColor: panelColor,
                        roles: [],
                        fields: [],
                    }
                }
            },
            {
                upsert: true,
            }
        );
    }
}