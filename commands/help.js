const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with the bot.'),
    async execute(interaction) {
        if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' I do not have permission to use this command. (Requires `ADMINISTRATOR`)')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        const helpEmbed = new EmbedBuilder()
            .setTitle('Help')
            .setDescription('Here is a list of all the commands.')
        // using a for loop to add all the commands to the embed
        for (const command of interaction.client.commands.values()) {
            helpEmbed.addFields({ name: `/${command.data.name}`, value: `${command.data.description}` });
        }
        helpEmbed.setColor(randomColor);
        await interaction.reply({ embeds: [helpEmbed] });
    }
}
