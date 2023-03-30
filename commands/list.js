const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const achivmentSchema = require('../achivment-schema.js');
const linkSchema = require( '../links-schema.js');
const selfroles = require('../selfroles-schema.js');
const { Emojis, Colors } = require('../statics.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('List something.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('links')
                .setDescription('List all links.')
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('panels')
            .setDescription('List all panels.')
        ).addSubcommand(subcommand =>
            subcommand
            .setName('achievements')
            .setDescription('List all achievements.')
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'links') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            const guild = interaction.guild.id;
            let links = await linkSchema.findOne({ guildID: guild })
    
            if (!links.links) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You have no link dispensers in your server.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            const embed = new EmbedBuilder()
                .setTitle('Link Dispensers')
                .setDescription('Here are all the configured link dispensers in your guild.')
                .setColor(Colors.normal);
            
            for(let i = 0; i < links.links.length; i++) {
                embed.addFields(
                    { name: 'Name', value: links.links[i].linkName, inline: true },
                    { name: 'Description', value: links.links[i].linkDescription, inline: true },
                    { name: '\u200B', value: '\u200B' , inline: true },
                );
            }
            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'panels') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command. (Requires `ADMINISTRATOR`)')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const guild = interaction.guild.id;
            const panel = await selfroles.findOne({ guildID: guild });

            if (!panel.panels.length > 0 || !panel.panels) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' There are no panels configued in this guild.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const panelNames = [];
            const panelDescription = [];

            for(let i = 0; i< panel.panels.length; i++) {
                panelNames.push(panel.panels[i].panelName);
                panelDescription.push(panel.panels[i].panelDescription);
            }
            const embed = new EmbedBuilder()
                .setTitle(interaction.guild.name + '\'s panels')
                .setDescription("These are all the configued panels in this guild.")
                .setColor(Colors.normal);
            for (let i = 0; i < panelNames.length; i++) {
                embed.addFields(
                    { name: 'Name', value: panelNames[i], inline: true },
                    { name: 'Description', value: panelDescription[i], inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                );
            }
            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'achievements') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const guild = interaction.guild.id;
            let achievements = await achivmentSchema.findOne({ guildID: guild });

            if (!achievements.achievements || !achievements.achievements.length > 0) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' There are no achievements in this guild.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle(interaction.guild.name + '\'s achievements')
                .setDescription("These are all the configued achievements in this guild.")
                .setColor(Colors.normal);
            
            for (let i = 0; i < achievements.achievements.length; i++) {
                embed.addFields(
                    { name: 'Name', value: achievements.achievements[i].name, inline: true },
                    { name: 'Description', value: achievements.achievements[i].description, inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                );
            }
            await interaction.reply({ embeds: [embed] });
        }
    }
}

