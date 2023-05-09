const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, Emoji } = require('discord.js');
const alertSchema = require('../alert-schema.js');
const guild = require('../guild-schema.js');
const Leave = require('../leave-schema.js');
const Welcome = require('../welcome-schema.js');
const { Emojis, Colors } = require('../statics.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Set something.')
        .addSubcommandGroup(group =>
                group
                .setName('alert')
                .setDescription('Set an alert.')
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
                                        .setRequired(false))),
        ).addSubcommand(subcommand =>
            subcommand
            .setName('report')
            .setDescription('Set the report channel.')
            .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the report channel.').setRequired(true)),
        ).addSubcommand(subcommand =>
            subcommand
            .setName('leave')
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
        ).addSubcommand(subcommand =>
            subcommand
            .setName('review')
            .setDescription('Sets the review channel.')
            .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the review channel.').setRequired(true)),
        ).addSubcommand(subcommand =>
            subcommand
            .setName('suggest')
            .setDescription('Sets the suggestion channel.')
            .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the suggestion channel.').setRequired(false))
        ).addSubcommand(subcommand =>
            subcommand
            .setName('welcome')
            .setDescription('Set the welcome message for this server')
            .addStringOption(option => option.setName('channel').setDescription('The channel to send the welcome message in').setRequired(true))
            .addStringOption(option => option.setName('title').setDescription('The title of the welcome message').setRequired(true))
            .addStringOption(option => option.setName('color').setDescription('The color of the welcome message').setRequired(true).addChoices(
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
            .addStringOption(option => option.setName('message').setDescription('The message to send when a user joins').setRequired(true))
            .addBooleanOption(option => option.setName('mention').setDescription('Do you want a mention on the outside of the embed?').setRequired(true))
        ),
    async execute(interaction) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
            return;
        }
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) {
            return await interaction.reply({ content: Emojis.error + ' I do not have permission to send embeds.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();
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
                    .setDescription(Emojis.error + ' You do not have permission to use this command.')
                    .setColor(Colors.error)
                return await interaction.reply({ embeds: [embed], ephemeral: true });
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
                .setDescription(Emojis.success + ` Successfully set a role alert for ${role.name}.`)
                .setColor(Colors.success)
            return await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'report') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command.')
                    .setColor(Colors.error)
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            const channel = interaction.options.getChannel('channel');

            await guild.findOneAndUpdate({
                guildID: interaction.guild.id
            }, {
                guildID: interaction.guild.id,
                reportChannel: channel.id
            }, {
                upsert: true
            });
    
            // send confirmation message
            await interaction.reply(`Set the report channel to ${channel}.`);
        } else if (subcommand === 'leave') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command.')
                    .setColor(Colors.error)
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const channel = interaction.options.getString('channel');
            const title = interaction.options.getString('title');

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
                .setDescription(Emojis.success + ` The leave message has been set to the following:\n\n**Channel:** ${channel}\n**Title:** \`${title}\`\n**Color:** \`${color}\`\n**Message:** \`${message}\``)
                .setColor(Colors.success)
            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'review') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command.')
                    .setColor(Colors.error)
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const guilds = await guild.findOne({ guildID: interaction.guild.id });
            
            if (!guilds) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You must set a suggestion channel before setting a review channel.')
                    .setColor(Colors.error)
    
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                
            const data = await guild.findOne({ guildID: interaction.guild.id });
            const channel = interaction.options.getChannel('channel');
            if (data.acceptChannel) {
                data.acceptChannel = channel.id;
                await data.save();
                const embed = new EmbedBuilder()
                .setDescription(Emojis.success + ` The review channel has been set to ${channel}.`)
                .setColor(Colors.success)
    
                return await interaction.reply({ embeds: [embed] });
            }
            const embed = new EmbedBuilder()
                .setDescription(Emojis.success + ` The review channel has been set to ${channel}.`)
                .setColor(Colors.success)
    
            await interaction.reply({ embeds: [embed] });
    
            await guild.findOneAndUpdate({ guildID: interaction.guild.id }, { acceptChannel: channel.id });
            }
        } else if (subcommand === 'suggest') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
                const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You do not have permission to use this command.')
                .setColor(Colors.error)
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            const channel = interaction.options.getChannel('channel');
            if(!channel) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.success + ' The system has been disabled!')
                    .setColor(Colors.success)
                
                await guild.findOneAndDelete({ guildID: interaction.guild.id });
                return await interaction.reply({ embeds: [embed] });;
            }
            // if suggestion channel already exists, update it
            let data = await guild.findOne({ guildID: interaction.guild.id });
            
            if (data) {
                if (data.channelID) {
                guild.findOneAndUpdate({ guildID: interaction.guild.id }, { channelID: channel.id });
                const embed = new EmbedBuilder()
                .setDescription(Emojis.success + ` The suggestion channel has been set to ${channel}. Run this command without a channel to disable the system. Run \`\`\`/setreview\`\`\` to set the review channel.`)
                .setColor(Colors.success)
                return await interaction.reply({ embeds: [embed] });
                }
            }
            const embed = new EmbedBuilder()
                .setDescription(Emojis.success + ` The suggestion channel has been set to ${channel}. Run this command without a channel to disable the system. Run \`\`\`/setreview\`\`\` to set the review channel.`)
                .setColor(Colors.success)
            await interaction.reply({ embeds: [embed] });

            await new guild({
                guildID: interaction.guild.id,
                channelID: channel.id
            }).save();
        } else if (subcommand === 'welcome') {
            if (!interaction.member.permissions.has(PermissionsBitField.FLAGS.ADMINISTRATOR)) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command.')
                    .setColor(Colors.error)
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            
            const channel = interaction.options.getString('channel');
            const title = interaction.options.getString('title');
    
            const message = await interaction.options.getString('message');
            const mention = await interaction.options.getBoolean('mention');
            let color = await colorSorter(await interaction.options.getString('color'))

            await Welcome.findOneAndUpdate({
                guildID: interaction.guild.id
            }, {
                guildID: interaction.guild.id,
                welcomeChannel: channel,
                welcomeTitle: title,
                welcomeColor: color,
                welcomeMessage: message,
                outsideMention: mention
            }, {
                upsert: true
            });

            const embed = new EmbedBuilder()
                .setDescription(Emojis.success + ` The welcome message has been set to the following:\n\nChannel: ${channel}\nTitle: \`${title}\`\nColor: \`${color == 'random' ? 'Random' : color}\`\nMessage: \`${message}\``)
                .setColor(Colors.success)
                .setTimestamp()
            await interaction.reply({ embeds: [embed] });
        }
    }
}
