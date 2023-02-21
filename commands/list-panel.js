const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const selfroles = require( '../selfroles-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list-panels')
        .setDescription('Lists all the panels in your server.'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const guild = interaction.guild.id;
        const panel = await selfroles.findOne({ guildID: guild });
        if (!panel) {
            return await interaction.reply({ content: `You have no panels in your server.`, ephemeral: true });
        }
        const panelNames = [];
        const panelDescription = [];
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        for(let i = 0; i< panel.panels.length; i++) {
            panelNames.push(panel.panels[i].panelName);
            panelDescription.push(panel.panels[i].panelDescription);
        }
        const embed = new EmbedBuilder()
            .setTitle('Panels')
            .setDescription("Your server's panels")
            .setColor(randomColor);
        for (let i = 0; i < panelNames.length; i++) {
            embed.addFields({ name: panelNames[i], value: panelDescription[i] });
        }
        await interaction.reply({ embeds: [embed] });
    }
}
