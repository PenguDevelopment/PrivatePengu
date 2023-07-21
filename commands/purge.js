const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { Emojis, Colors } = require('../statics.js');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purges a specified amount of messages. (Old messages are fine.)')
        .addIntegerOption(option => option.setName('amount').setDescription('The amount of messages to purge.').setRequired(true)),
    async execute(interaction) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' I do not have permission to use this command.')
                .setColor(Colors.error)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        };
        
        const amount = interaction.options.getInteger('amount');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You do not have permission to use this command.')
                .setColor(Colors.error)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (amount > 100) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You can only purge up to 100 messages at a time.')
                .setColor(Colors.error)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let messages = await interaction.channel.messages.fetch({ limit: amount });
        const oldMessages = messages.filter(message => message.createdTimestamp < Date.now() - 1209600000);

        const embed = new EmbedBuilder()
            .setDescription(Emojis.loading + ` Working on the job...`)
            .setColor(Colors.normal)
        await interaction.reply({ embeds: [embed], ephemeral: true });


        if (oldMessages.size > 0) {
            await oldMessages.forEach(async message => {
                await message.delete();
                if (message.id === oldMessages.last().id) {
                    await interaction.channel.messages.fetch(oldMessages.last().id).catch(() => { });                }
            });

            messages = await messages.filter(message => !oldMessages.has(message.id));
        }
        
        let totalSize = await oldMessages.size + await messages.size;

        const successEmbed = new EmbedBuilder()
            .setDescription(Emojis.success + ` Successfully purged ${await totalSize} messages.`)
            .setColor(Colors.success)
        await interaction.editReply({ embeds: [successEmbed], ephemeral: true });

        await interaction.channel.bulkDelete(messages);
    }
};
