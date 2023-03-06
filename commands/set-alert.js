const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const alertSchema = require('../alert-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-alert')
        .setDescription('Set an alert for the server.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('Set a role alert.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to set an alert for when gained or lost.')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to send the alert in.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('The title of the alert.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('The description of the alert.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('The color of the alert.')
                        .setRequired(true)
                        .addChoices(
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
                        .addRoleOption(option =>
                            option.setName('pingrole')
                                .setDescription('The role to ping when the alert is triggered.')
                                .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('boost')
                .setDescription('Set a boost alert.')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to send the alert in.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('The title of the alert.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('The description of the alert.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('The color of the alert.')
                        .setRequired(true)
                        .addChoices(
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
        )).addRoleOption(option =>
            option.setName('pingrole')
                .setDescription('The role to ping when the alert is triggered.')
                .setRequired(false))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
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
        if (subcommand === 'role') {
            const guild = interaction.guild.id;
            const role = interaction.options.getRole('role');
            let pingRole = interaction.options.getRole('pingrole');
            const channel = interaction.options.getChannel('channel');
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const color = interaction.options.getString('color');

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('You do not have permission to use this command.')
                    .setColor(colorSorter(color))
                    .setTimestamp()
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (!pingRole) {
                pingRole = 'none';
            }
            await alertSchema.findOneAndUpdate({
                guildID: guild,
            }, {
                guildID: guild,
                $push: {
                    roles: {
                        roleId: role.id,
                        pingRole: pingRole,
                        channelId: channel.id,
                        title: title,
                        description: description,
                        color: color,
                    }
                }
            }, {
                upsert: true,
            });
            const embed = new EmbedBuilder()
                .setTitle('Success')
                .setDescription(`Successfully set a role alert for ${role.name}.`)
                .setColor(colorSorter(color))
                .setTimestamp()
            return await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'boost') {
            const guild = interaction.guild.id;
            let pingRole = interaction.options.getRole('role');
            const channel = interaction.options.getChannel('channel');
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const color = interaction.options.getString('color');

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('You do not have permission to use this command.')
                    .setColor(colorSorter(color))
                    .setTimestamp()
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (!pingRole) {
                pingRole = 'none';
            }
            await alertSchema.findOneAndUpdate({
                guildID: guild,
            }, {
                guildID: guild,
                $push: {
                    boosts: {
                        pingRole: pingRole,
                        channelId: channel.id,
                        title: title,
                        description: description,
                        color: color,
                    }
                }
            }, {
                upsert: true,
            });
            const embed = new EmbedBuilder()
                .setTitle('Success')
                .setDescription(`Successfully set a boost alert.`)
                .setColor(colorSorter(color))
                .setTimestamp()
            return await interaction.reply({ embeds: [embed] });
        }
    }
}
