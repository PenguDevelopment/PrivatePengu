const { SlashCommandBuilder } = require('discord.js');
const guild = require('../guild-schema.js');
const { EmbedBuilder } = require('discord.js');
var randomColor = Math.floor(Math.random()*16777215).toString(16);
const { PermissionsBitField } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setreview')
        .setDescription('Sets the review channel.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the review channel.').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_GUILD')) {
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('You do not have permission to use this command.')
                .setColor(randomColor)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            const embed = new EmbedBuilder()
            .setTitle('Error!')
            .setDescription('You do not have permission to use this command.')
            .setColor(randomColor)
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const guilds = await guild.findOne({ guildID: interaction.guild.id });
        if (!guilds) {
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('You must set a suggestion channel before setting a review channel.')
                .setColor(randomColor)

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            // if review channel already exists, update it
        const data = await guild.findOne({ guildID: interaction.guild.id });
        const channel = interaction.options.getChannel('channel');
        if (data.acceptChannel) {
            data.acceptChannel = channel.id;
            await data.save();
            const embed = new EmbedBuilder()
            .setTitle('Review Channel Set!')
            .setDescription(`The review channel has been set to ${channel}.`)
            .setColor(randomColor)

            return await interaction.reply({ embeds: [embed] });
        }
        const embed = new EmbedBuilder()
            .setTitle('Review Channel Set!')
            .setDescription(`The review channel has been set to ${channel}.`)
            .setColor(randomColor)

        await interaction.reply({ embeds: [embed] });

        await guild.findOneAndUpdate({ guildID: interaction.guild.id }, { acceptChannel: channel.id });
        }
    }
};
