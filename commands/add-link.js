const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const linksSchema = require( '../links-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-links')
        .setDescription('Add links to your link dispenser.')
        .addStringOption(option => option.setName('link-name').setDescription('The name of the link dispenser.').setRequired(true))
        .addStringOption(option => option.setName('link').setDescription('The link to add to the link dispenser.').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const linkName = interaction.options.getString('link-name');
            const link = interaction.options.getString('link');
            const guild = interaction.guild.id;
            // find panel
            const links = await linksSchema.findOne({ guildID: guild });
            if (!links) {
                return await interaction.reply({ content: `You have no link dispensers in your server.`, ephemeral: true });
            }
            let targetLink;
            for(let i = 0; i< links.links.length; i++) {
                if(links.links[i].linkName === linkName) {
                    targetLink = links.links[i];
                    break;
                }
            }
            if(!targetLink) {
                return await interaction.reply({ content: `The link dispenser \`${linkName}\` does not exist.`, ephemeral: true });
            }
        
            // check if link is already in panel
            for (const link of targetLink.links) {
                if (link.link === link) {
                    return await interaction.reply({ content: `The link \`${link}\` already exists in the link dispenser \`${linkName}\`.`, ephemeral: true });
                }
            }
            
            await linksSchema.updateOne({
                guild,
                'links.linkName': linkName
            }, {
                $push: {
                    'links.$.links': { 
                        link
                    }
                }
            })
        const successEmbed = new EmbedBuilder()
            .setTitle('Success!')
            .setDescription(`Added the link \`${link}\` to the link dispenser \`${linkName}\`.`)
            .setColor(randomColor);
        await interaction.reply({ embeds: [successEmbed] });
    }
}

