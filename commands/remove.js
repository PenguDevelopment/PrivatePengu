const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const linkSchema = require( '../modals/links-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove something.')
        .addSubcommand(subcommand => subcommand
            .setName('links')
            .setDescription('Remove a link dispenser from your server.')
            .addStringOption(option => option.setName('dispenser-name').setDescription('The name of the link dispenser.').setRequired(true))
            .addStringOption(option => option.setName('link-name').setDescription('The name of the link you want to remove.').setRequired(true))
        ),
    async execute(interaction) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You do not have permission to use this command.')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const dispenserName = interaction.options.getString('dispenser-name');
        const linkName = interaction.options.getString('link-name');
        const guild = interaction.guild.id;
        // find the specific link dispenser
        
        const linkDispensers = await linkSchema.findOne({ guildID: guild });
        if (!linkDispensers) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You have no link dispensers in your server.')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const linkDispenser = linkDispensers.links.find(link => link.linkName === dispenserName);
        if (!linkDispenser) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You have no link dispenser with that name.')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        // find the specific link
        const link = linkDispenser.links.find(link => link.linkName === linkName);
        if (!link) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You have no link with that name.')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        // remove the link
        linkDispenser.links.splice(linkDispenser.links.indexOf(link), 1);
        await linkDispensers.save();
        const embed = new EmbedBuilder()
            .setDescription(Emojis.success + ' You have successfully removed the link.')
            .setColor(Colors.success);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}