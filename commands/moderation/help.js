const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Emojis, Colors } = require('../../statics.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with the bot.')
        .addStringOption(option =>
            option
                .setName('page')
                .setDescription('The page you want to go to.')
                .setRequired(false)
        ),
    async execute(interaction) {

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');
        const page = interaction.options.getString('page');
    
        if (!page) {
            const helpEmbed = new EmbedBuilder()
            .setTitle('Help')
            .setDescription('Here is a list of pages.')
            .setColor(Colors.normal)
            .addFields(
                {
                    name: 'Page 1',
                    value: 'Moderation'
                },
                {
                    name: 'Page 2',
                    value: 'Economy'
                },
            )
            .setTimestamp();
            await interaction.reply({ embeds: [helpEmbed] });
        } else {
            const commandsInfo = [];
            for (const command of interaction.client.commands.values()) {
                commandsInfo.push({ name: `/${command.data.name}`, value: `${command.data.description}`, usage: `${command.data.usage}`, category: `${command.category}` });
            }

            if (page === '1') {
                const moderationCommands = commandsInfo.filter(command => command.category !== 'economy');
                const moderationEmbed = new EmbedBuilder()
                    .setTitle('Moderation')
                    .setDescription('Here is a list of moderation commands.')
                    .setColor(Colors.normal)
                    for (const command of moderationCommands) {
                        moderationEmbed.addFields({name: command.name, value: command.value });
                    }
                    moderationEmbed.setTimestamp();
                    await interaction.reply({ embeds: [moderationEmbed] });
            } else if (page === '2') {
                const economyCommands = commandsInfo.filter(command => command.category === 'economy');
                const economyEmbed = new EmbedBuilder()
                    .setTitle('Economy')
                    .setDescription('Here is a list of economy commands.')
                    .setColor(Colors.normal)
                    for (const command of economyCommands) {
                        economyEmbed.addFields({ name: command.name, value: command.value });
                    }
                    economyEmbed.setTimestamp();
                    await interaction.reply({ embeds: [economyEmbed] });
            } else {
                await interaction.reply('That page does not exist.');
            }
     }
    }
}
