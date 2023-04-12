const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with the bot.'),
    async execute(interaction) {

        if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
        if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');

        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        const helpEmbed = new EmbedBuilder()
            .setDescription('Here is a list of all the commands.')
        for (const command of interaction.client.commands.values()) {
            helpEmbed.addFields({ name: `/${command.data.name}`, value: `${command.data.description}` });
        }
        helpEmbed.setColor(randomColor);
        await interaction.reply({ embeds: [helpEmbed] });
    }
}
