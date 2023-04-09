const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const linkSchema = require( '../links-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove something.')
        .addSubcommand(subcommand => subcommand
            .setName('links')
            .setDescription('Remove a link dispenser from your server.')
            .addStringOption(option => option.setName('dispensername').setDescription('The name of the link dispenser.').setRequired(true))
            .addStringOption(option => option.setName('link-name').setDescription('The name of the link you want to remove.').setRequired(true))
        ),
    async execute(interaction) {
        if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' I do not have permission to use this command. (Requires `ADMINISTRATOR`)')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        // check if have permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('You do not have permission to use this command.')
                .setColor(randomColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const dispenserName = interaction.options.getString('dispensername');
        const linkName = interaction.options.getString('link-name');
        const guild = interaction.guild.id;
        // find the sepciific link dispenser
        
        const linkDispensers = await linkSchema.findOne({ guildID: guild });
        if (!linkDispensers) {
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('You have no link dispensers in your server.')
                .setColor(randomColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const linkDispenser = linkDispensers.links.find(link => link.linkName === dispenserName);
        if (!linkDispenser) {
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('You have no link dispenser with that name.')
                .setColor(randomColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        // find the specific link
        const link = linkDispenser.links.find(link => link.linkName === linkName);
        if (!link) {
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('You have no link with that name.')
                .setColor(randomColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        // remove the link
        linkDispenser.links.splice(linkDispenser.links.indexOf(link), 1);
        await linkDispensers.save();
        const embed = new EmbedBuilder()
            .setTitle('Success!')
            .setDescription('You have successfully removed the link.')
            .setColor(randomColor);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}