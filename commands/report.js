const { SlashCommandBuilder } = require('discord.js');
const guilds = require('../guild-schema.js');
const { EmbedBuilder } = require('discord.js');
var randomColor = Math.floor(Math.random()*16777215).toString(16);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a user.')
        .addUserOption(option => option.setName('user').setDescription('The user to report.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the report.').setRequired(true)),
    async execute(interaction) {
        if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' I do not have permission to use this command. (Requires `ADMINISTRATOR`)')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        // check if report channel exists
        const guild = await guilds.findOne({
            guildID: interaction.guild.id
        });
        if (!guild.reportChannel) {
            return await interaction.reply('The report channel has not been set.');
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
        });

        // send confirmation message
        await interaction.reply({ content: `Reported ${user} for ${reason}.`, ephemeral: true });
    }
};