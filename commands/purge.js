const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
var randomColor = Math.floor(Math.random()*16777215).toString(16);
const { PermissionsBitField } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purges a specified amount of messages.')
        .addIntegerOption(option => option.setName('amount').setDescription('The amount of messages to purge.').setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        // check if user has permission manage_messages
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const embed = new EmbedBuilder()
                .setTitle('Error!') 
                .setDescription('You do not have permission to use this command.')
                .setColor(randomColor)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (amount > 100) {
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('You can only purge up to 100 messages.')
                .setColor(randomColor)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        // check if messages are under 14 days old
        const messages = await interaction.channel.messages.fetch({ limit: amount });
        const oldMessages = messages.filter(message => message.createdTimestamp < Date.now() - 1209600000);
        if (oldMessages.size > 0) {
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('You can only purge messages that are under 14 days old.')
                .setColor(randomColor)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        await interaction.channel.bulkDelete(amount);
        const embed = new EmbedBuilder()
            .setTitle('Purge Successful!')
            .setDescription(`Successfully purged ${amount} messages.`)
            .setColor(randomColor)
        await interaction.reply({ embeds: [embed] });
    }
};
