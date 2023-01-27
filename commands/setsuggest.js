const { SlashCommandBuilder } = require('discord.js');
const guild = require('../guild-schema.js');
const { EmbedBuilder } = require('discord.js');
var randomColor = Math.floor(Math.random()*16777215).toString(16);
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setsuggest')
        .setDescription('Sets the suggestion channel.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the suggestion channel.').setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            const embed = new EmbedBuilder()
            .setTitle('Error!')
            .setDescription('You do not have permission to use this command.')
            .setColor(randomColor)
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const channel = interaction.options.getChannel('channel');
        if(!channel) {
            const embed = new EmbedBuilder()
                .setTitle('Ok...?')
                .setDescription('The system has been disabled!')
                .setColor(randomColor)
            await guild.findOneAndDelete({ guildID: interaction.guild.id });
            return interaction.reply({ embeds: [embed] });;
        }
        // if suggestion channel already exists, update it
        let data = await guild.findOne({ guildID: interaction.guild.id });
        if (data) {
            if (data.channelID) {
            // update the channelID mongoose model
            guild.findOneAndUpdate({ guildID: interaction.guild.id }, { channelID: channel.id });
            const embed = new EmbedBuilder()
            .setTitle('Suggestion Channel Set!')
            .setDescription(`The suggestion channel has been set to ${channel}. Run this command without a channel to disable the system. Run \`\`\`/setreview\`\`\` to set the review channel.`)
            .setColor(randomColor)
            return await interaction.reply({ embeds: [embed] });
            }
        }
        const embed = new EmbedBuilder()
            .setTitle('Suggestion Channel Set!')
            .setDescription(`The suggestion channel has been set to ${channel}. Run this command without a channel to disable the system. Run \`\`\`/setreview\`\`\` to set the review channel.`)
            .setColor(randomColor)
        await interaction.reply({ embeds: [embed] });
        // await new suggest document for the guild and channel
        await new guild({
            guildID: interaction.guild.id,
            channelID: channel.id
        }).save();
    }
};