const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const selfroles = require( '../selfroles-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send-panel')
        .setDescription('Send your finished panel to a channel. (make sure you have already added your roles with /add-roles)')
        .addStringOption(option => option.setName('panel-name').setDescription('The name of the panel.').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('The channel to send the panel to.').setRequired(true)),
    async execute(interaction) {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        // check if have permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const panelName = interaction.options.getString('panel-name');
        const channel = interaction.options.getChannel('channel');
        const guild = interaction.guild;
        // find panel
        const panel = await selfroles.findOne({ guild });
        if (!panel) {
            return await interaction.reply({ content: `No panels exist for this server.`, ephemeral: true });
        }
        let targetPanel;
        for(let i = 0; i< panel.panels.length; i++) {
            if(panel.panels[i].panelName === panelName) {
                targetPanel = panel.panels[i];
                break;
            }
        }
        if(!targetPanel) {
            return await interaction.reply({ content: `The panel \`${panelName}\` does not exist.`, ephemeral: true });
        }
        // send panel
        const panelEmbed = new EmbedBuilder()
            .setTitle(targetPanel.panelName)
            .setDescription(targetPanel.panelDescription)
            .setColor(randomColor);
        for (const field of targetPanel.fields) {
            panelEmbed.addFields({ name: field.fieldName, value: field.fieldValue });
        }
        const message = await channel.send({ embeds: [panelEmbed] });
        for (const role of targetPanel.roles) {
            await message.react(role.emoji).catch(
                () => interaction.reply({ content: `The emoji \`${role.emoji}\` is invalid.`, ephemeral: true })
            );
        }
        const embed = new EmbedBuilder()
            .setTitle('Success!')
            .setDescription(`Sent the panel \`${panelName}\` to ${channel}.`)
            .setColor(randomColor);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

