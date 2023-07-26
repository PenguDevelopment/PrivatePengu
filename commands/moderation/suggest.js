const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require('discord.js');
const guild = require('../../modals/guild-schema.js');
const suggest = require('../../modals/suggestions-schema.js');
const { Emojis, Colors, EmojisIds } = require("../../statics.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest something!')
        .addStringOption(option => option.setName('suggestion').setDescription('The suggestion to send.').setRequired(true)),
    async execute(interaction) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');

        const suggestion = interaction.options.getString('suggestion');
        const guilds = await guild.findOne({ guildID: interaction.guild.id });
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
        var id = genId(8);
        if (!guilds) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' This server does not have suggestions channel set up.')
                .setColor(Colors.error)
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (!guilds.acceptChannel) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You must set a review channel before sending a suggestion.')
                .setColor(Colors.error)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
        // get the review channel and send the suggestion there with buttons accept and deny
        const reviewChannel = interaction.guild.channels.cache.get(guilds.acceptChannel);
        const embed = new EmbedBuilder()
            // .setTitle('Information')
            .setAuthor({ name: "New Suggestion", iconURL: interaction.user.avatarURL({ dynamic: true })})
            .setDescription(`Suggestion By: <@${interaction.user.id}>`)
            .addFields({ name: 'Suggestion:', value: `${suggestion}` })
            .setColor(Colors.normal)
            .setTimestamp()
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Accept')
                    .setStyle(1)
                    .setEmoji('✅')
                    .setCustomId(`sug-${id}-approve`),
                new ButtonBuilder()
                    .setLabel('Deny')
                    .setStyle(4)
                    .setEmoji('⛔')
                    .setCustomId(`sug-${id}-deny`)
            )
        const msg = await reviewChannel.send({ embeds: [embed], components: [row] });
        // reply success
        const embed2 = new EmbedBuilder()
            .setDescription(Emojis.success + ` Your suggestion has been submitted for review.`)
            .setColor(Colors.success)
        await interaction.reply({ embeds: [embed2], ephemeral: true });
        await new suggest({
            id: id,
            suggestionId: id,
            suggestion: suggestion,
            author: interaction.user.id,
            reviewMessageId: msg.id,
            status: 'pending',
            votes: {
                yes: 0,
                no: 0
            }
        }).save();
    }
}
}
