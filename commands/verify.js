const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ButtonBuilder } = require('discord.js');
const { ActionRowBuilder } = require('discord.js');
var randomColor = Math.floor(Math.random()*16777215).toString(16);
const verify = require('../verify-schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Set up a button menu to verify people when they join your server!')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to send the button menu in.').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('The role to give to people who click the button.').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');
        const guild = interaction.guild;
        const guildId = guild.id;
        const channelId = channel.id;
        const roleId = role.id;
        function genId(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() *
                    charactersLength));
            }
            return result;
        }
        var specificId = genId(8);
        const embed = new EmbedBuilder()
            .setTitle('Success!')
            .setDescription(`Successfully set up a button menu to verify people in ${channel}.`)
            .setColor(randomColor)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`verify-${specificId}-${guildId}-${channelId}-${roleId}`)
                    .setLabel('Verify')
                    .setStyle(3)
            )
        const embed2 = new EmbedBuilder()
            .setTitle('Verify')
            .setDescription('Click the button below to verify yourself.')
            .setColor(randomColor)
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
        await channel.send({ embeds: [embed2], components: [row] });
        
        const messageId = channel.lastMessageId;
        await new verify({
            specificId: `${specificId}`,
            guildId: guildId,
            channelId: channelId,
            roleId: roleId,
            messageId: messageId
        }).save();
    }
}