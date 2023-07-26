const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const guilds = require('../../modals/guild-schema.js');
var randomColor = Math.floor(Math.random()*16777215).toString(16);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a user.')
        .addUserOption(option => option.setName('user').setDescription('The user to report.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the report.').setRequired(true)),
    async execute(interaction) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');
        // check if report channel exists
        const guild = await guilds.findOne({
            guildID: interaction.guild.id
        });
        if (!guild.reportChannel) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You have not set a report channel.')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        // get report channel
        const reportChannel = interaction.guild.channels.cache.get(guild.reportChannel);
        // send report message
        const embed = new EmbedBuilder()
            .setTitle('Report')
            .setDescription(`Reported by ${interaction.user}`)
            .addFields(
                { name: 'Reason:', value: `${reason}` },
                { name: 'Reported User:', value: `${user}` }
            )
            .setColor(randomColor)

        await reportChannel.send({
            embeds: [embed]
        }).catch(err => {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' I was unable to send the report message.')
                .setColor(Colors.error);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        });

        // send confirmation message
        const embed2 = new EmbedBuilder()
            .setDescription(Emojis.success + ' You have successfully reported the user.')
            .setColor(Colors.success);
        await interaction.reply({ embeds: [embed2], ephemeral: true });
    }
};