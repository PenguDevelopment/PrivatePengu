const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const selfroles = require( '../selfroles-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-roles')
        .setDescription('Add roles to your panel.')
        .addStringOption(option => option.setName('panel-name').setDescription('The name of the panel.').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('The role to add to the panel.').setRequired(true))
        .addStringOption(option => option.setName('emoji').setDescription('The emoji to add to the panel.').setRequired(true)),
        async execute(interaction) {
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            // check if have permission
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }
            const panelName = interaction.options.getString('panel-name');
            const role = interaction.options.getRole('role');
            let emoji = interaction.options.getString('emoji');
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
            if(emoji.startsWith(':') && emoji.endsWith(':')) {
                const emojiFromCache = interaction.client.emojis.cache.find(emoji => emoji.name === emoji.slice(1, -1));
                if (!emojiFromCache) {
                    return await interaction.reply({ content: `The emoji \`${emoji}\` is invalid.`, ephemeral: true });
                }
                emoji = emojiFromCache.toString();
            }
        
            // check if role is already in panel
            for (const roler of targetPanel.roles) {
                if (roler.roleID === role.id) {
                    return await interaction.reply({ content: `The role \`${role.name}\` already exists in the panel \`${panelName}\`.`, ephemeral: true });
                }
            }
            // check if emoji is already in panel
            if (targetPanel.roles.find(r => r.emoji === emoji)) {
                return await interaction.reply({ content: `The emoji \`${emoji}\` already exists in the panel \`${panelName}\`.`, ephemeral: true });
            }
            
            if (targetPanel.roles.length >= 20) {
                return await interaction.reply({ content: `The panel \`${panelName}\` already has 20 roles.`, ephemeral: true });
            }
            await selfroles.updateOne({
                guild,
                'panels.panelName': panelName
            }, {
                $push: {
                    'panels.$.roles': {
                        roleID: role.id,
                        emoji: emoji
                    }
                }
            })
        const successEmbed = new EmbedBuilder()
            .setTitle('Success!')
            .setDescription(`Added the role \`${role.name}\` to the panel \`${panelName}\`.`)
            .setColor(randomColor);
        await interaction.reply({ embeds: [successEmbed] });
    }
}

