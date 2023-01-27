const { SlashCommandBuilder } = require('discord.js');
const guilds = require('../guild-schema.js');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-report')
        .setDescription('Set the report channel.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the report channel.').setRequired(true)),
    async execute(interaction) {
        // check if have permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const channel = interaction.options.getChannel('channel');
        // save channel to guilds report channel
        await guilds.findOneAndUpdate({
            guildID: interaction.guild.id
        }, {
            guildID: interaction.guild.id,
            reportChannel: channel.id
        }, {
            upsert: true
        });

        // send confirmation message
        await interaction.reply(`Set the report channel to ${channel}.`);
    },
};