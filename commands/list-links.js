const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const linkSchema = require( '../links-schema.js');
const { Emojis, Colors } = require('../statics.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list-links')
        .setDescription('List all the link dispensers in your server.'),
    async execute(interaction) {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        // check if have permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                // .setTitle('Error!')
                .setDescription(Emojis.error + ' You do not have permission to use this command.')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const guild = interaction.guild.id;
        // find all link dispensers, then add it to fields in a embed
        const links = linkSchema.findOne({ guildID: guild });

        if (!links.links) {
            const embed = new EmbedBuilder()
                // .setTitle('Error!')
                .setDescription(Emojis.error + ' You have no link dispensers in your server.')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Link Dispensers')
            .setDescription('Here are all the link dispensers in your server.')
            .setColor(randomColor);
        
        for(let i = 0; i < links.links.length; i++) {
            embed.addField(links.links[i].linkName, links.links[i].linkDescription);
        }
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

