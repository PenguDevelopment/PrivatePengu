const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const selfroles = require( '../selfroles-schema.js');
const { Emojis, Colors } = require('../statics.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-fields')
        .setDescription('Add fields to your panel.')
        .addStringOption(option => option.setName('panel-name').setDescription('The name of the panel.').setRequired(true))
        .addStringOption(option => option.setName('field-name').setDescription('The name of the field.').setRequired(true))
        .addStringOption(option => option.setName('field-value').setDescription('The value of the field.').setRequired(true))
        .addBooleanOption(option => option.setName('inline').setDescription('Whether the field is inline or not.').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: Emojis.error + ' You do not have permission to use this command.', ephemeral: true });
        }
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        const panelName = interaction.options.getString('panel-name');
        const fieldName = interaction.options.getString('field-name');
        const fieldValue = interaction.options.getString('field-value');
        const inline = interaction.options.getBoolean('inline');
        const guild = interaction.guild.id;
        // find panel
        const panel = await selfroles.findOne({ guildID: guild });
        if (!panel) {
            return await interaction.reply({ content: Emojis.error + ` There are no panels in your guild.`, ephemeral: true });
        }
        let targetPanel;
        for(let i = 0; i< panel.panels.length; i++) {
            if(panel.panels[i].panelName === panelName) {
                targetPanel = panel.panels[i];
                break;
            }
        }
        if(!targetPanel) {
            return await interaction.reply({ content: Emojis.error + ` The panel \`${panelName}\` does not exist.`, ephemeral: true });
        }
        // add field with update one
        await selfroles.updateOne({
            guild,
            'panels.panelName': panelName
        }, {
            $push: {
                'panels.$.fields': {
                    fieldName,
                    fieldValue,
                    inline
                }
            }
        });
        
        const embed = new EmbedBuilder()
            // .setTitle('Success!')
            .setDescription(Emojis.success + ` Added the field \`${fieldName}\` to the panel \`${panelName}\`.`)
            .setColor(Colors.success);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}